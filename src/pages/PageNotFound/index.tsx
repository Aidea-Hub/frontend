import { Box, Button, Container, Heading, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import Header from '../../components/Head'
import { NAVBAR_HEIGHT, ROUTES } from '../../constants'
import { themeSelector } from '../../recoil/selectors'

export default function PageNotFound() {
  const navigate = useNavigate()
  const theme = useRecoilValue(themeSelector)

  return (
    <>
      <Header
        title="Not Found"
        description="Create AI Generated Ideas. Try it now!"
      />
      <Container maxW="5xl" minH={`calc(100vh - ${NAVBAR_HEIGHT}px)`}>
        <Box textAlign="center" py={10} px={6}>
          <Heading
            display="inline-block"
            as="h2"
            size="2xl"
            bgGradient={`linear(to-r, ${theme}.400,${theme}.600)`}
            backgroundClip="text"
          >
            404
          </Heading>
          <Text fontSize="18px" mt={3} mb={2}>
            Page Not Found
          </Text>
          <Text color={'gray.500'} mb={6}>
            The page you&apos;re looking for does not seem to exist
          </Text>

          <Button
            colorScheme={`${theme}`}
            bgGradient={`linear(to-r, ${theme}.400, ${theme}.500, ${theme}.600)`}
            color="white"
            variant="solid"
            onClick={() => navigate(ROUTES.HOME)}
          >
            Go to Home
          </Button>
        </Box>
      </Container>
    </>
  )
}
