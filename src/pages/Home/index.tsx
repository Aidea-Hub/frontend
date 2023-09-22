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
import { getAnalytics, logEvent } from 'firebase/analytics'
import { useRecoilValue } from 'recoil'
import Header from '../../components/Head'
import firebase from '../../config/firebase'
import { themeSelector } from '../../recoil/selectors'

const analytics = getAnalytics(firebase)

export default function Home() {
  const theme = useRecoilValue(themeSelector)

  return (
    <>
      <Header
        title="Generate Ideas"
        description="Create ideas for your next project"
      />
      <Container maxW={'5xl'} minH={`calc(100vh - ${200}px)`}>
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
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Stack spacing={4}>
            <Heading>Bring ideas to life</Heading>
            <Text color={'gray.500'} fontSize={'lg'}>
              Generate your idea
            </Text>
            <Input></Input>
          </Stack>
          {/* <IdeaGenerator
            tags={tags}
            onClickTag={handleTagAccordianClick}
            requestType={REQUEST_TYPES.GENERATE_IMAGE}
            isDisabled={true}
          /> */}
        </SimpleGrid>
      </Container>
    </>
  )
}
