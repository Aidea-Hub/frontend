import { CloseIcon, SearchIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  SimpleGrid,
  Spacer,
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
import keywordExtractor from 'keyword-extractor'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { stemmer } from 'stemmer'
import Header from '../../components/Head'
import IdeaCard from '../../components/IdeaCard'
import PreviewIdea from '../../components/PreviewIdea'
import PulsingDot from '../../components/PulsingDot'
import firebase from '../../config/firebase'
import { ROUTES } from '../../constants'
import { gallerySortAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'

const PAGE_LIMIT = 15
const db = getFirestore(firebase)
const analytics = getAnalytics(firebase)

export const GallerySortOptions = [
  { name: 'Latest Created', value: 'created_at-desc' },
  { name: 'Earliest Created', value: 'created_at-asc' },
  { name: 'Highest Votes', value: 'votes-desc' },
  // { name: 'Lowest Votes', value: 'votes-asc' },
]

const Gallery = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedPost, setSelectedPost] = useState(null)
  const [lastVisible, setLastVisible] = useState<DocumentData>()
  const [ideas, setIdeas] = useState<any[]>([])
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isLoading, setLoading] = useState(true)
  const [isEmpty, setEmpty] = useState(true)
  const gallerySort = useRecoilValue(gallerySortAtom)
  const navigate = useNavigate()

  const theme = useRecoilValue(themeSelector)

  const [value, setValue] = useState('')
  const [keyword, setKeyword] = useState('')

  const handleSubmit = () => {
    const extractedKeywords = keywordExtractor.extract(value, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    })
    if (extractedKeywords.length > 0) {
      setKeyword(stemmer(extractedKeywords[0]))
      console.log(keyword)
    } else {
      setKeyword(value)
    }
  }

  const view = (post: any) => {
    setSelectedPost(post)
    onOpen()
  }

  const queryBuilder = (isFirst = false) => {
    let q = query(collection(db, 'ideas'))
    q = query(q, where('isPublic', '==', true))

    if (keyword) {
      q = query(q, where('keywords', 'array-contains', keyword))
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

    setEmpty(newIdeas.length == 0)

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
  }, [keyword, gallerySort])

  return (
    <>
      <Header title="Search" description="Find any ideas you want" />
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
                <Text fontSize="lg" fontWeight="semibold" mt={2} mb={4}>
                  Find any ideas you want
                </Text>
                <Center mb={8}>
                  <Flex>
                    <InputGroup width="full">
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300" />
                      </InputLeftElement>
                      <Input
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        placeholder="Search for ideas"
                      />
                      <InputRightElement>
                        <CloseIcon
                          fontSize="sm"
                          onClick={() => {
                            setValue('')
                            setKeyword('')
                          }}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <Spacer mx={2} />
                    <Button onClick={handleSubmit} colorScheme={`${theme}`}>
                      Search
                    </Button>
                  </Flex>
                </Center>
              </Box>
              {isEmpty && (
                <Box textAlign="center" py={10} px={6}>
                  <Box display="inline-block">
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      bg={`${theme}.500`}
                      rounded={'50px'}
                      w={'55px'}
                      h={'55px'}
                      textAlign="center"
                    >
                      <SearchIcon boxSize={'30px'} color={'white'} />
                    </Flex>
                  </Box>

                  <Heading as="h2" size="xl" mt={6} mb={2}>
                    No Search results found
                  </Heading>
                  <Text color={'gray.500'}>
                    Try using different keywords, or be the first to generate a
                    similar idea yourself{' '}
                    <Link
                      color={`${theme}.500`}
                      onClick={() => navigate(ROUTES.HOME)}
                    >
                      here
                    </Link>
                    💡
                  </Text>
                </Box>
              )}
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

export default Gallery
