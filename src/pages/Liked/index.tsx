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
import ImageCard from '../../components/ImageCard'
import PreviewImage from '../../components/PreviewImage'
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
  const [images, setImages] = useState<any[]>([])
  const [hasNextPage, setHasNextPage] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const view = (post: any) => {
    setSelectedPost(post)
    onOpen()
  }

  const getInitialImages = async () => {
    console.log('getInitialImages')
    console.log('user.liked_images', user.liked_images)
    logEvent(analytics, 'liked_get_initial_images', {
      sort: likedSort,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newImages: any[] = []
    const userLikedImages = [...user.liked_images]
    if (likedSort === 'liked_at-desc') {
      setLikes(userLikedImages.reverse())
    } else {
      setLikes(userLikedImages)
    }

    const len = Math.min(PAGE_LIMIT, userLikedImages.length)
    for (let i = 0; i < len; i++) {
      newImages.push({
        id: userLikedImages[i],
        url: getCDNUrl(userLikedImages[i]),
      })
    }

    if (len > 0) {
      setLastVisible(len)
    }

    setHasNextPage(newImages.length == PAGE_LIMIT)

    setImages(newImages)
    setLoading(false)
    console.log('newImages', newImages)
  }

  const fetchNextPage = async () => {
    console.log('fetchNextPage')

    if (lastVisible !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newImages: any[] = []
      const len = Math.min(lastVisible + 1 + PAGE_LIMIT, likes.length)
      for (let i = lastVisible + 1; i < len; i++) {
        newImages.push({
          id: likes[i],
          url: getCDNUrl(likes[i]),
        })
      }

      if (len > 0) {
        setLastVisible(len)
      }

      setHasNextPage(newImages.length == PAGE_LIMIT)
      setImages([...images, ...newImages])
      console.log('newImages', newImages)
    }
  }

  useEffect(() => {
    getInitialImages()
  }, [])

  useEffect(() => {
    getInitialImages()
  }, [likedSort])

  return (
    <>
      <Header
        title="Liked Images"
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
                  Browse images liked by you
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
                  {images.map((post: any) => (
                    <ImageCard key={post.id} image={post} onImageClick={view} />
                  ))}
                </SimpleGrid>
              </InfiniteScroll>

              {selectedPost && (
                <PreviewImage
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
