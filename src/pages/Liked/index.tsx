/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { getAnalytics } from 'firebase/analytics'
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useRecoilValue } from 'recoil'
import Header from '../../components/Head'
import IdeaCard from '../../components/IdeaCard'
import PreviewIdea from '../../components/PreviewIdea'
import PulsingDot from '../../components/PulsingDot'
import firebase from '../../config/firebase'
import { likedSortAtom, userAtom } from '../../recoil/atoms'

const PAGE_LIMIT = 15
const analytics = getAnalytics(firebase)
const db = getFirestore(firebase)

export const LikedSortOptions = [
  { name: 'Latest Liked', value: 'liked_at-desc' },
  { name: 'Earliest Liked', value: 'liked_at-asc' },
]

const Liked = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedPost, setSelectedPost] = useState(null)
  const likedSort = useRecoilValue(likedSortAtom)
  const user = useRecoilValue(userAtom)
  const [isLoading, setLoading] = useState(true)

  const [lastVisible, setLastVisible] = useState<number>()

  const [likes, setLikes] = useState<string[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ideas, setIdeas] = useState<any[]>([])
  const [hasNextPage, setHasNextPage] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const view = (post: any) => {
    setSelectedPost(post)
    onOpen()
  }

  const getIdeasByIds = async (ids: string[]) => {
    console.log('ids', ids)
    const ideasRef = collection(db, 'ideas')

    const newIdeas: any[] = []
    // Using Promise.all to fetch all documents in parallel
    const allDocs = await Promise.all(ids.map(id => getDoc(doc(ideasRef, id))))

    allDocs.forEach(doc => {
      if (doc.exists()) {
        newIdeas.push({
          id: doc.id,
          ...doc.data(),
        })
      }
    })

    console.log('newIdeas', newIdeas)

    return newIdeas
  }

  const getInitialIdeas = async () => {
    setLoading(true)

    const sortedLikes = [...user.liked_ideas]
    if (likedSort === 'liked_at-desc') {
      sortedLikes.reverse()
    }

    setLikes(sortedLikes)

    const batchIds = sortedLikes.slice(0, PAGE_LIMIT)
    const newIdeas = await getIdeasByIds(batchIds)

    if (batchIds.length > 0) {
      setLastVisible(batchIds.length - 1)
    }

    setHasNextPage(newIdeas.length === PAGE_LIMIT)
    console.log('newIdeas', newIdeas)
    setIdeas(newIdeas)
    setLoading(false)
  }
  const fetchNextPage = async () => {
    if (lastVisible !== undefined) {
      const nextBatchIds = likes.slice(
        lastVisible + 1,
        lastVisible + 1 + PAGE_LIMIT
      )
      const newIdeas = await getIdeasByIds(nextBatchIds)

      setLastVisible(lastVisible + nextBatchIds.length)
      setHasNextPage(newIdeas.length === PAGE_LIMIT)
      setIdeas([...ideas, ...newIdeas])
      console.log('newIdeas', newIdeas)
    }
  }

  useEffect(() => {
    getInitialIdeas()
  }, [])

  useEffect(() => {
    getInitialIdeas()
  }, [likedSort])

  return (
    <>
      <Header
        title="Liked Ideas"
        description="View your liked AI generated ideas"
      />
      <Box minHeight="100vh" display="flex" flexDir="column">
        {isLoading ? (
          <PulsingDot />
        ) : (
          <>
            <Container flex={1} maxW="5xl">
              <Box textAlign="center">
                <Heading as="h1" size="4xl">
                  Liked
                </Heading>
                <Text fontSize="lg" fontWeight="semibold" mt={2}>
                  Browse ideas liked by you
                </Text>
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

export default Liked
