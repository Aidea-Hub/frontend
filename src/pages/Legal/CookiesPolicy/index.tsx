import { Box, Container } from '@chakra-ui/react'
import Header from '../../../components/Head'
import cookiesPolicy from './generated'

const CookiesPolicy = () => (
  <>
    <Header title="Cookies Policy" description="Cookies Policy for Aidea hub" />
    <Container maxW={'5xl'}>
      <Box
        backgroundColor="white"
        p={5}
        dangerouslySetInnerHTML={{ __html: cookiesPolicy }}
      />
    </Container>
  </>
)

export default CookiesPolicy
