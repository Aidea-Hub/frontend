import { Box, Container } from '@chakra-ui/react'
import Header from '../../../components/Head'
import tos from './generated'

const TermsOfService = () => (
  <>
    <Header
      title="Terms Of Service"
      description="Terms Of Service for Aidea hub"
    />
    <Container maxW={'5xl'}>
      <Box
        backgroundColor="white"
        p={5}
        dangerouslySetInnerHTML={{ __html: tos }}
      />
    </Container>
  </>
)

export default TermsOfService
