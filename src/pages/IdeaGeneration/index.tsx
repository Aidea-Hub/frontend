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
import { getAnalytics, logEvent } from 'firebase/analytics'
import { getFirestore, Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import IdeaCard from '../../components/IdeaCard'
import firebase from '../../config/firebase'
import { Idea, NAVBAR_HEIGHT, ROUTES } from '../../constants'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'
import authApi from '../../api/authApi'

const analytics = getAnalytics(firebase)

const ERROR_MSG = "Failed to generate response, please contact us on Discord for assistance.";

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
  const [user, setUser] = useRecoilState(userAtom)
  const [progress, setProgress] = useState(0) // for loading bar
  const [loadingInterval, setLoadingInterval] = useState<NodeJS.Timeout>()
  const [isCreatingNewIdea, setIsCreatingNewIdea] = useState<boolean>(false)

  const INTERVAL_FN = () => {
    if (progress == 99) {
      return
    }
    setProgress(progress => progress + 1)
  }
  // interval will go to 100 in 90 seconds
  const INTERVAL_TIME = (1000 * 90) / 100

  useEffect(() => {
    resetLoading()

    console.log('problem :>> ', problem)
    // initial load, generate the 4 ideas
    authApi
      .post(`generateIdeas`, {
        userId: user.uid,
        problem,
      })
      .then(res => {
        console.log('res.data.data :>> ', res.data.data)
        setIdeas(res.data.data.ideas)
        setIsLoading(false)
      })

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
    if (!isLoading) {
      // clear interval
      if (loadingInterval) {
        clearInterval(loadingInterval)
      }
    }
  }, [isLoading])

  const generateMoreIdeas = () => {
    logEvent(analytics, 'generate_more_ideas', {
      problem: problem,
    })
    // check if user selected anything
    if (selectedPost === null) {
      return
    }

    resetLoading()
    authApi
      .post(`generateIdeas`, {
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
  }

  const navigate = useNavigate()

  const generateIdeaContent = async () => {
    logEvent(analytics, 'generate_idea_content', {
      problem: problem,
    })
    // check if user selected anything
    if (isLoading || selectedPost === null) {
      return
    }

    setIsCreatingNewIdea(true)
    setProgress(0)
    const interval = setInterval(INTERVAL_FN, INTERVAL_TIME)
    setLoadingInterval(interval)

    // TODO: call endpoint and pass idea_id to new page
    await authApi
      .post(
        `generateIdeaContent`,
        {
          userId: user.uid,
          title: selectedPost.title,
          description: selectedPost.description,
        }
      )
      .then(res => {
        navigate(`${ROUTES.FULL_IDEA_BASE}\\${res.data.ideaId}`)
      })
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
            {isCreatingNewIdea &&
              'Setting up our genius team to generate your idea for you... You will be redirected to the full idea page shortly!'}
            {(isLoading || isCreatingNewIdea) && (
              <Progress mt={3} colorScheme={theme} hasStripe value={progress} />
            )}
            {(!isLoading && !isCreatingNewIdea) &&
              'Select your favourite idea out of the 4, and you can either generate more similar ideas, or you can generate the full idea!'}
          </Heading>
        </Stack>
        {!isLoading && !isCreatingNewIdea && (
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
                colorScheme={
                  isLoading || selectedPost === null ? 'gray' : theme
                }
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
                colorScheme={
                  isLoading || selectedPost === null ? 'gray' : theme
                }
                color={useColorModeValue('white', 'black')}
                onClick={generateMoreIdeas}
              >
                {'Generate Similar'}
              </Button>
            </Stack>
          </Stack>
        )}
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
            ideas.filter(idea => idea !== ERROR_MSG).map((idea: string, idx: number) => {
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
