import {
  Box,
  Flex,
  Image as Img,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useRecoilValue } from 'recoil'
import { Image } from '../../constants'
import { userAtom } from '../../recoil/atoms'
import LikeButton from '../LikeButton'
import VoteButton from '../VoteButton'

const MotionImg = motion(Img)

interface ImageCardProps {
  image: Image
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImageClick: any
}

export default function ImageCard({ image, onImageClick }: ImageCardProps) {
  const cardColor = useColorModeValue('gray.100', 'gray.700')
  const user = useRecoilValue(userAtom)
  const { colorMode } = useColorMode()

  const isBlacklisted = () => {
    if (user.votes[image.id] && user.votes[image.id] === -1) {
      return true
    }
    if (Array.isArray(image.tags)) {
      return image.tags.some(item => user.blacklist.includes(item))
    }
    return false
  }

  return (
    <Box
      backgroundColor={cardColor}
      borderRadius={['sm', null, 'md']}
      overflow="hidden"
    >
      <Box
        onClick={() => onImageClick(image)}
        cursor="pointer"
        h="240px"
        position="relative"
        overflow="hidden"
      >
        <MotionImg
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          w="100%"
          h="100%"
          objectFit="cover"
          src={image.url}
          fallbackSrc={`https://dummyimage.com/${512}x${768}/${
            colorMode === 'light' ? 'aaa' : 'fff'
          }/${
            colorMode === 'light' ? 'FED7D7' : 'C53030'
          }.png&text=Image+removed+or+does+not+exist`}
          style={{
            filter: isBlacklisted() ? 'blur(16px)' : '',
          }}
          fallbackStrategy="onError"
        />
      </Box>
      <Flex px="4" py="2" align="center" justify="space-between" w="100%">
        <VoteButton imageId={image.id} />
        <Flex align="center">
          <LikeButton imageId={image.id} />
          <Text ml={1} fontSize={['xs', null, 'sm']}>
            {image.created_at &&
              new Date(image.created_at.seconds * 1000).toLocaleDateString()}
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}
