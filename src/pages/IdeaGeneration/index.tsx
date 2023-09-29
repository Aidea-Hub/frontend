import {
  Alert,
  AlertIcon,
  Button,
  Container,
  Heading,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import axios from 'axios'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore, Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import IdeaCard from '../../components/IdeaCard'
import firebase from '../../config/firebase'
import { Idea, NAVBAR_HEIGHT, ROUTES } from '../../constants'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'

const analytics = getAnalytics(firebase)

const IdeaGeneration = () => {
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
  const [progress, setProgress] = useState(0) // for loading bar
  const [loadingInterval, setLoadingInterval] = useState<NodeJS.Timeout>()

  const INTERVAL_FN = () => {
    if (progress == 99) {
      return
    }
    setProgress(progress => progress + 1)
  }
  // interval will go to 100 in 75 seconds
  const INTERVAL_TIME = (1000 * 75) / 100

  // prevent user from leaving the page
  useEffect(() => {
    const unloadCallback = (event: any) => {
      event.preventDefault()
      event.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', unloadCallback)
    return () => window.removeEventListener('beforeunload', unloadCallback)
  }, [])

  useEffect(() => {
    resetLoading()

    //   console.log('problem :>> ', problem)
    // initial load, generate the 4 ideas
    axios
      .post('https://us-central1-aidea-hub.cloudfunctions.net/generateIdeas', {
        userId: user.uid,
        problem,
      })
      .then(res => {
        console.log('res.data.data :>> ', res.data.data)
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

    return () => {
      clearInterval(loadingInterval)
    }
  }, [])

  const resetLoading = () => {
    setIsLoading(true)
    const interval = setInterval(INTERVAL_FN, INTERVAL_TIME)
    setLoadingInterval(interval)
    setProgress(0)
  }

  useEffect(() => {
    if (isLoading) {
      // Make API call to get ideas
      // set ideas
      // setIsLoading(false)
    } else {
      // clear interval
      if (loadingInterval) {
        clearInterval(loadingInterval)
      }
    }
  }, [isLoading])

  const generateMoreIdeas = () => {
    // check if user selected anything
    if (selectedPost === null) {
      return
    }

    resetLoading()
    axios
      .post('https://us-central1-aidea-hub.cloudfunctions.net/generateIdeas', {
        userId: user.uid,
        problem,
        numIdeas: 3,
      })
      .then(res => {
        const oldSelected = selectedPost.title + ': ' + selectedPost.description
        setIdeas([oldSelected, ...res.data.data.ideas])
        setSelectedPost(null)
        setIsLoading(false)
      })
    // setTimeout(() => {
    //   console.log('This will run after 60 second!')
    //   setIsLoading(false)
    //   setIdeas([
    //     'Idea: test title: description',
    //     'Idea New: test 1: description',
    //     'Idea 50001 New: test 2: description',
    //   ])
    // }, 5000)
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
        {isLoading && (
          <Alert status="warning" borderRadius={6} mb={10}>
            <AlertIcon />
            <Text as="span">
              Do not close or refresh the webpage while the ideas are being
              generated!
            </Text>
          </Alert>
        )}

        <Stack spacing={4} mb={3}>
          <Heading
            color={useColorModeValue('black', 'white')}
            fontSize={'lg'}
            textAlign={'center'}
          >
            {isLoading && 'Generating some genius ideas...'}
            {isLoading && (
              <Progress mt={3} colorScheme={theme} hasStripe value={progress} />
            )}
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
          <Stack
            direction={'column'}
            w={'50%'}
            justifyContent={'space-between'}
          >
            <Text
              color={
                selectedPost === null
                  ? 'gray.400'
                  : useColorModeValue('black', 'white')
              }
              fontSize={'lg'}
              textAlign={'center'}
            >
              Satisfied with the selected idea?
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
          <Stack
            direction={'column'}
            width={'50%'}
            justifyContent={'space-between'}
          >
            <Text
              color={
                selectedPost === null
                  ? 'gray.400'
                  : useColorModeValue('black', 'white')
              }
              fontSize={'lg'}
              textAlign={'center'}
            >
              Generate more ideas similar to selected?
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
