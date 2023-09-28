import {
  Button,
  Container,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore, Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import IdeaCard from '../../components/IdeaCard'
import PreviewIdea from '../../components/PreviewIdea'
import firebase from '../../config/firebase'
import { Idea, NAVBAR_HEIGHT, ROUTES } from '../../constants'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'
import axios from 'axios'

const analytics = getAnalytics(firebase)

const IdeaGeneration = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const selectIdea = (content: any) => {
    setSelectedPost(content)
  }

  const [ideas, setIdeas] = useState<string[]>([])
  const theme = useRecoilValue(themeSelector)
  const { state } = useLocation()
  const { problem } = state
  const db = getFirestore(firebase)

  const [user, setUser] = useRecoilState(userAtom)

  useEffect(() => {
    console.log('problem :>> ', problem)
    // initial load, generate the 4 ideas
    axios.post("https://us-central1-aidea-hub.cloudfunctions.net/generateIdeas", {
      userId: user.uid,
      problem
    }).then((res) => {
      console.log('res.data.data :>> ', res.data.data);
      setIdeas(res.data.data.ideas)
      setIsLoading(false)
    })
    // setTimeout(() => {
    //   console.log('This will run after 60 second!')
    //   setIsLoading(false)
    //   setIdeas([
    //     'Idea: test title: description',
    //     'Idea New: test 1: description',
    //     'Idea 50001 New: test 2: description',
    //     'Idea dasdafjkljfklsd: test 3: description',
    //   ])
    // }, 1000)
  }, [])

  useEffect(() => {
    if (isLoading) {
      // Make API call to get ideas
      // set ideas
      // setIsLoading(false)
    }
  }, [isLoading])

  const generateMoreIdeas = () => {
    // check if user selected anything
    if (selectedPost === null) {
      return
    }

    setIsLoading(true)
    axios.post("https://us-central1-aidea-hub.cloudfunctions.net/generateIdeas", {
      userId: user.uid,
      problem,
      numIdeas: 3,
    }).then((res) => {
      const oldSelected = selectedPost.title + ": " + selectedPost.description
      setIdeas([oldSelected, ...res.data.data.ideas])
      setSelectedPost(null)
      setIsLoading(false)
    })
  }

  const navigate = useNavigate()
  
  const generateIdeaContent = async () => {
    // check if user selected anything
    if (isLoading || selectedPost === null) {
      return
    }

    // TODO: call endpoint and pass idea_id to new page
    const id = 'ybqC51U4OYxzCOQGh4kU'

    navigate(`${ROUTES.FULL_IDEA_BASE}\\${id}`)
  }

  function processIdea(input: string) {
    // Remove the prefix "Idea XXX:"
    const processedString = input.replace(/^Idea\s(?:[^:]+:\s)?/, '')

    // Split the processed string by ":"
    const res = processedString.split(':')
    const title = res[0]
    // join the rest of the array back together
    const description = res.slice(1).join(':')
    return { title, description }
  }

  return (
    <>
      <Container maxW={'5xl'} minH={`calc(100vh - ${NAVBAR_HEIGHT}px)`}>
        <Stack spacing={4} mb={3}>
          <Heading
            color={useColorModeValue('black', 'white')}
            fontSize={'lg'}
            textAlign={'center'}
          >
            {isLoading && 'Generating some genius ideas...'}
            {!isLoading &&
              'Select your favourite idea out of the 4, and you can either generate more similar ideas, or you can generate the full idea!'}
          </Heading>
        </Stack>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          mb={3}
          h={'100px'}
        >
          <Stack direction={'column'} width={'50%'}>
            <Text
              color={
                selectedPost === null
                  ? 'gray.400'
                  : useColorModeValue('black', 'white')
              }
              fontSize={'lg'}
              textAlign={'center'}
            >
              If you are satisfied with the idea:
            </Text>
            <Button
              isDisabled={isLoading || selectedPost === null}
              size="lg"
              colorScheme={isLoading || selectedPost === null ? 'gray' : theme}
              color={useColorModeValue('white', 'black')}
              onClick={generateIdeaContent}
            >
              {'Continue'}
            </Button>
          </Stack>
          <Stack direction={'column'} width={'50%'}>
            <Text
              color={
                selectedPost === null
                  ? 'gray.400'
                  : useColorModeValue('black', 'white')
              }
              fontSize={'lg'}
              textAlign={'center'}
            >
              If you want to generate more ideas like the selected one:
            </Text>
            <Button
              isDisabled={isLoading || selectedPost === null}
              size="lg"
              colorScheme={isLoading || selectedPost === null ? 'gray' : theme}
              color={useColorModeValue('white', 'black')}
              onClick={generateMoreIdeas}
            >
              {'Generate Similar'}
            </Button>
          </Stack>
        </Stack>
        <SimpleGrid h={'800px'} columns={{ base: 1, md: 2 }} spacing={5} mb={5}>
          {isLoading && (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}
          {!isLoading &&
            ideas.map((idea: string, idx: number) => {
              const { title, description } = processIdea(idea)
              const post: Idea = {
                id: idx.toString(),
                ai_model: '',
                title: title,
                description: description,
                url: 'https://dummyimage.com/600x400/000/fff',
                tags: [],
                votes: 0,
                created_at: Timestamp.now(),
                request_id: '1',
                user_id: '1',
                keywords: ['1'],
              }
              return (
                <IdeaCard
                  key={idx}
                  idea={post}
                  onIdeaClick={() => selectIdea(post)}
                  selected={selectedPost && post.id === selectedPost.id}
                  isGeneratedIdea={true}
                />
              )
            })}
        </SimpleGrid>
      </Container>
    </>
  )
}

export default IdeaGeneration
