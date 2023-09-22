import { Box, Container, Heading, Text } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import Header from '../../components/Head'
import { themeSelector } from '../../recoil/selectors'

export default function PastIdeas() {
  const theme = useRecoilValue(themeSelector)

  return (
    <>
      <Header
        title="Generate AI Ideas"
        description="Create AI Generated Ideas. Try it now!"
      />
      <Container maxW={'5xl'} minH={`calc(100vh - ${200}px)`}>
        <Box textAlign="center">
          <Heading as="h1" size="4xl">
            Past Ideas
          </Heading>
          <Text fontSize="lg" fontWeight="semibold" mt={2} mb={2}>
            View all your past generated ideas here
          </Text>
        </Box>
      </Container>
    </>
  )
}
