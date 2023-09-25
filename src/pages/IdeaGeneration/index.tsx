import {
  Button,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { getAnalytics } from 'firebase/analytics'
import { Timestamp } from 'firebase/firestore'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import IdeaCard from '../../components/IdeaCard'
import PreviewIdea from '../../components/PreviewIdea'
import firebase from '../../config/firebase'
import { Idea, NAVBAR_HEIGHT } from '../../constants'
import { themeSelector } from '../../recoil/selectors'

const analytics = getAnalytics(firebase)

const IdeaGeneration = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedPost, setSelectedPost] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const selectIdea = (id: any) => {
    console.log('post :>> ', id)
    setSelectedPost(id)
  }

  const ideas: Idea[] = [
    {
      id: '1',
      ai_model: '1',
      title: 'Idea 1',
      description: 'This is the first idea',
      url: 'https://dummyimage.com/600x400/000/fff',
      tags: ['tag1', 'tag2', 'tag3'],
      votes: 0,
      created_at: Timestamp.now(),
      request_id: '1',
      user_id: '1',
      keywords: ['1'],
    },
    {
      id: '2',
      ai_model: '1',
      title: 'Idea 1',
      description: 'This is the first idea',
      url: 'https://dummyimage.com/600x400/000/fff',
      tags: ['tag1', 'tag2', 'tag3'],
      votes: 0,
      created_at: Timestamp.now(),
      request_id: '1',
      user_id: '1',
      keywords: ['1'],
    },
    {
      id: '3',
      ai_model: '1',
      title: 'Idea 1',
      description: 'This is the first idea',
      url: 'https://dummyimage.com/600x400/000/fff',
      tags: ['tag1', 'tag2', 'tag3'],
      votes: 0,
      created_at: Timestamp.now(),
      request_id: '1',
      user_id: '1',
      keywords: ['1'],
    },
    {
      id: '4',
      ai_model: '1',
      title: 'Idea 1',
      description: 'This is the first idea',
      url: 'https://dummyimage.com/600x400/000/fff',
      tags: ['tag1', 'tag2', 'tag3'],
      votes: 0,
      created_at: Timestamp.now(),
      request_id: '1',
      user_id: '1',
      keywords: ['1'],
    },
  ]
  const theme = useRecoilValue(themeSelector)
  return (
    <>
      <Container maxW={'5xl'} minH={`calc(100vh - ${NAVBAR_HEIGHT}px)`}>
        <Stack spacing={4} mb={3}>
          <Heading
            color={useColorModeValue('black', 'white')}
            fontSize={'lg'}
            textAlign={'center'}
          >
            Select your favourite idea out of the 4, and you can either generate
            more similar ideas, or you can generate the full
            idea!
          </Heading>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} mb={3}>
          <Stack direction={'column'} width={'50%'}>
            <Text
              color={selectedPost === null ? "gray.400" : useColorModeValue('black', 'white')}
              fontSize={'lg'}
              textAlign={'center'}
            >
              If you are satisfied with the idea:
            </Text>
            <Button 
            disabled={selectedPost === null}
            size="lg"
            colorScheme={selectedPost === null ? "gray" : theme}
            color={useColorModeValue('white', 'black')}>
              {'Continue'}
            </Button>
          </Stack>
          <Stack direction={'column'} width={'50%'}>
            <Text
              color={selectedPost === null ? "gray.400" : useColorModeValue('black', 'white')}
              fontSize={'lg'}
              textAlign={'center'}
            >
              If you want to generate more ideas like the selected one:
            </Text>
            <Button
              disabled={selectedPost === null}
              size="lg"
              colorScheme={selectedPost === null ? "gray" : theme}
              color={useColorModeValue('white', 'black')}
            >
              {'Generate Similar'}
            </Button>
          </Stack>
        </Stack>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={5}>
          {ideas.map((post: any) => (
            <IdeaCard
              key={post.id}
              idea={post}
              onIdeaClick={() => selectIdea(post.id)}
              selected={post.id === selectedPost}
              isGeneratedIdea={true}
            />
          ))}
          {selectedPost && (
            <PreviewIdea
              isOpen={isOpen}
              onClose={onClose}
              post={selectedPost}
            />
          )}
        </SimpleGrid>
      </Container>
    </>
  )
}

export default IdeaGeneration
