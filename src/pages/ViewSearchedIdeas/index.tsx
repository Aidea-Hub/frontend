/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Center,
  Container,
  Heading,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { getAnalytics, logEvent } from 'firebase/analytics'
import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import Header from '../../components/Head'
import IdeaCard from '../../components/IdeaCard'
import PreviewIdea from '../../components/PreviewIdea'
import PulsingDot from '../../components/PulsingDot'
import SelectedTagList from '../../components/SelectedTagList'
import firebase from '../../config/firebase'
import { gallerySortAtom } from '../../recoil/atoms'

const PAGE_LIMIT = 15
const db = getFirestore(firebase)
const analytics = getAnalytics(firebase)

export const ViewSearchedIdeasSortOptions = [
  { name: 'Latest Created', value: 'created_at-desc' },
  { name: 'Earliest Created', value: 'created_at-asc' },
  { name: 'Highest Votes', value: 'votes-desc' },
  // { name: 'Lowest Votes', value: 'votes-asc' },
]

const ViewSearchedIdeas = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedPost, setSelectedPost] = useState(null)
  const [lastVisible, setLastVisible] = useState<DocumentData>()
  const [ideas, setIdeas] = useState<any[]>([])
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isLoading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedTags = searchParams.getAll('tags')

  const gallerySort = useRecoilValue(gallerySortAtom)
  const view = (post: any) => {
    setSelectedPost(post)
    onOpen()
  }

  const sortAndJoinTags = (selectedTags: string[]): string => {
    return selectedTags.sort().join(',')
  }

  const queryBuilder = (isFirst = false) => {
    let q = query(collection(db, 'ideas'))
    console.log('selectedTags', selectedTags)
    if (selectedTags) {
      q = query(q, where('tags_string', '==', sortAndJoinTags(selectedTags)))
    }
    const sort = gallerySort.split('-')
    if (sort.length === 2 && (sort[1] === 'asc' || sort[1] === 'desc')) {
      q = query(q, orderBy(sort[0], sort[1]))
    }
    q = query(q, limit(PAGE_LIMIT))
    if (!isFirst) {
      q = query(q, startAfter(lastVisible))
    }
    return q
  }

  const getInitialIdeas = async () => {
    logEvent(analytics, 'gallery_get_initial_ideas', {
      sort: gallerySort,
    })
    const q = queryBuilder(true)
    // TODO change to index of last doc
    // TOOD document design changes to likes etc in notesbook or docs
    const querySnapshot = await getDocs(q)
    const newIdeas: any[] = []
    const ideasDocs = querySnapshot.docs
    ideasDocs.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      newIdeas.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    if (ideasDocs.length > 0) {
      setLastVisible(ideasDocs[ideasDocs.length - 1])
    }

    setHasNextPage(newIdeas.length == PAGE_LIMIT)

    setIdeas(newIdeas)
    setLoading(false)
    console.log('newIdeas', newIdeas)
  }

  const fetchNextPage = async () => {
    console.log('fetchNextPage')

    if (lastVisible) {
      const q = queryBuilder()
      const querySnapshot = await getDocs(q)
      const newIdeas: any[] = []
      const ideasDocs = querySnapshot.docs
      ideasDocs.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        newIdeas.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      if (ideasDocs.length > 0) {
        setLastVisible(ideasDocs[ideasDocs.length - 1])
      }

      setHasNextPage(newIdeas.length == PAGE_LIMIT)
      setIdeas([...ideas, ...newIdeas])
      console.log('newIdeas', newIdeas)
    }
  }

  useEffect(() => {
    getInitialIdeas()
  }, [])

  useEffect(() => {
    getInitialIdeas()
  }, [gallerySort])

  return (
    <>
      <Header
        title="Search by Tags"
        description="Browse AI generated ideas by others"
      />
      <Box minHeight="100vh" display="flex" flexDir="column">
        {isLoading ? (
          <PulsingDot />
        ) : (
          <>
            <Container flex={1} maxW="5xl">
              <Box textAlign="center">
                <Heading as="h1" size="4xl">
                  Search
                </Heading>
                <Text fontSize="lg" fontWeight="semibold" mt={2}>
                  Find specific generated ideas and edit them to your liking
                </Text>
                <Center mt={4}>
                  {selectedTags && (
                    <SelectedTagList
                      tags={selectedTags}
                      isDisabled
                      onClick={
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        () => {}
                      }
                    />
                  )}
                </Center>
                {ideas.length === 0 && (
                  <Text fontWeight="semibold" mt={50}>
                    No matching ideas found. Please try again with a different
                    combination of tags, or generate them via our Idea
                    Generator.
                  </Text>
                )}
              </Box>
              <InfiniteScroll
                hasMore={hasNextPage}
                loadMore={fetchNextPage}
                loader={<PulsingDot />}
              >
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  spacing={5}
                  mt={6}
                >
                  {ideas.map((post: any) => (
                    <IdeaCard key={post.id} idea={post} onIdeaClick={view} />
                  ))}
                </SimpleGrid>
              </InfiniteScroll>
              {selectedPost && (
                <PreviewIdea
                  isOpen={isOpen}
                  onClose={onClose}
                  post={selectedPost}
                />
              )}
            </Container>
          </>
        )}
      </Box>
    </>
  )
}

export default ViewSearchedIdeas