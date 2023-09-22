/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useRecoilValue } from 'recoil'
import Header from '../../components/Head'
import IdeaCard from '../../components/IdeaCard'
import PreviewIdea from '../../components/PreviewIdea'
import PulsingDot from '../../components/PulsingDot'
import firebase from '../../config/firebase'
import { getCDNUrl } from '../../constants'
import { likedSortAtom, userAtom } from '../../recoil/atoms'

const PAGE_LIMIT = 15
const analytics = getAnalytics(firebase)

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

  const getInitialIdeas = async () => {
    console.log('getInitialIdeas')
    console.log('user.liked_ideas', user.liked_ideas)
    logEvent(analytics, 'liked_get_initial_ideas', {
      sort: likedSort,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newIdeas: any[] = []
    const userLikedIdeas = [...user.liked_ideas]
    if (likedSort === 'liked_at-desc') {
      setLikes(userLikedIdeas.reverse())
    } else {
      setLikes(userLikedIdeas)
    }

    const len = Math.min(PAGE_LIMIT, userLikedIdeas.length)
    for (let i = 0; i < len; i++) {
      newIdeas.push({
        id: userLikedIdeas[i],
        url: getCDNUrl(userLikedIdeas[i]),
      })
    }

    if (len > 0) {
      setLastVisible(len)
    }

    setHasNextPage(newIdeas.length == PAGE_LIMIT)

    setIdeas(newIdeas)
    setLoading(false)
    console.log('newIdeas', newIdeas)
  }

  const fetchNextPage = async () => {
    console.log('fetchNextPage')

    if (lastVisible !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newIdeas: any[] = []
      const len = Math.min(lastVisible + 1 + PAGE_LIMIT, likes.length)
      for (let i = lastVisible + 1; i < len; i++) {
        newIdeas.push({
          id: likes[i],
          url: getCDNUrl(likes[i]),
        })
      }

      if (len > 0) {
        setLastVisible(len)
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
