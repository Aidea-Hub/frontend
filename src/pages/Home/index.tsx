import {
  Alert,
  AlertIcon,
  Button,
  Container,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { useRecoilValue } from 'recoil'
import Header from '../../components/Head'
import firebase from '../../config/firebase'
import { themeSelector } from '../../recoil/selectors'
import { NAVBAR_HEIGHT, ROUTES } from '../../constants'
import { useNavigate } from 'react-router-dom'

const analytics = getAnalytics(firebase)

export default function Home() {
  const [problem, setProblem] = useState<string>("")
  const theme = useRecoilValue(themeSelector)
  const navigate = useNavigate();

  return (
    <>
      <Header
        title="Generate Ideas"
        description="Create ideas for your next project"
      />
      <Container maxW={'5xl'} minH={`calc(100vh - ${NAVBAR_HEIGHT}px)`}>
        <Alert status="info" borderRadius={6} mb={10}>
          <AlertIcon />
          <Text as="span">
            For our BETA program, we will only be giving limited tokens to
            selected users. Feel free to join our{' '}
            <Button
              as="a"
              variant="link"
              href="https://discord.gg/w2y4huedqB"
              colorScheme={`${theme}`}
              onClick={() => logEvent(analytics, 'home_alert_discord')}
            >
              Discord
            </Button>
            .
          </Text>
        </Alert>
        <SimpleGrid spacing={10}>
          <Stack width={"100%"} spacing={4}>
            <Heading width={"100%"}>What problem do you want to solve today?</Heading>
            <Text color={'gray.500'} fontSize={'lg'}>
              Let us generate some ideas for you!
            </Text>
            <Input onChange={(e) => setProblem(e.target.value)} placeholder='Please describe the problem you want to solve, e.g. I hate waiting in lines at the hospital'></Input>
          </Stack>
          <Button justifySelf={"center"} width={"40"} colorScheme={theme} onClick={() => navigate(ROUTES.IDEA_GENERATION, { state: { problem: problem } })}>Generate!</Button>
        </SimpleGrid>
      </Container>
    </>
  )
}
