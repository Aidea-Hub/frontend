import {
  Box,
  Button,
  Flex,
  Heading,
  Image as Img,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useRecoilValue } from 'recoil'
import { Idea } from '../../constants'
import { userAtom } from '../../recoil/atoms'
import LikeButton from '../LikeButton'
import VoteButton from '../VoteButton'
import { themeSelector } from '../../recoil/selectors'
import PreviewIdea from '../PreviewIdea'
import { useState } from 'react'

const MotionImg = motion(Img)

interface IdeaCardProps {
  idea: Idea
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onIdeaClick: any
  selected?: boolean
  isGeneratedIdea?: boolean
}

export default function IdeaCard({ idea, onIdeaClick, selected = false, isGeneratedIdea = false }: IdeaCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const cardColor = useColorModeValue('gray.100', 'gray.700')
  const user = useRecoilValue(userAtom)
  const { colorMode } = useColorMode()
  const theme = useRecoilValue(themeSelector)

  const isBlacklisted = () => {
    if (user.votes[idea.id] && user.votes[idea.id] === -1) {
      return true
    }
    if (Array.isArray(idea.tags)) {
      return idea.tags.some(item => user.blacklist.includes(item))
    }
    return false
  }

  return (
    <Box
      border={"4px"}
      borderColor={selected ? theme : "transparent"}
      backgroundColor={cardColor}
      borderRadius={['sm', null, 'md']}
      overflow="hidden"
      onClick={() => onIdeaClick(idea)}
      cursor="pointer"
    >
      {!isGeneratedIdea && <Box h="240px" position="relative" overflow="hidden">
        <MotionImg
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          w="100%"
          h="100%"
          objectFit="cover"
          src={idea.url}
          fallbackSrc={`https://dummyidea.com/${512}x${768}/${
            colorMode === 'light' ? 'aaa' : 'fff'
          }/${
            colorMode === 'light' ? 'FED7D7' : 'C53030'
          }.png&text=Idea+removed+or+does+not+exist`}
          style={{
            filter: !isGeneratedIdea && isBlacklisted() ? 'blur(16px)' : '',
          }}
          fallbackStrategy="onError"
        />
      </Box>}
      <Box p={4} h={150}>
        <Heading marginTop="1" size="md" noOfLines={2}>
          <Text textDecoration="none" maxWidth="100%">
            {idea.title}
          </Text>
        </Heading>
        <Text
          as="p"
          marginTop="2"
          color={useColorModeValue('gray.700', 'gray.200')}
          fontSize="md"
          maxWidth="100%"
          noOfLines={isGeneratedIdea ? 10 : 3}
        >
          {idea.description}
        </Text>
        {isGeneratedIdea && <Button mt={2} onClick={() => setIsOpen(true)}>Expand</Button>}
      </Box>
      {!isGeneratedIdea && <Flex px="4" py="2" align="center" justify="space-between" w="100%">
        <VoteButton ideaId={idea.id} />
        <Flex align="center">
          <LikeButton ideaId={idea.id} />
          <Text ml={1} fontSize={['xs', null, 'sm']}>
            {idea.created_at &&
              new Date(idea.created_at.seconds * 1000).toLocaleDateString()}
          </Text>
        </Flex>
      </Flex>}
      {selected && isGeneratedIdea && isOpen && <PreviewIdea isOpen={isOpen} onClose={() => setIsOpen(false)} post={idea} isGeneratedIdea={isGeneratedIdea}/>}
    </Box>
  )
}
