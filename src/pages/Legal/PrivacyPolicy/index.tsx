import { Box, Container } from '@chakra-ui/react'
import Header from '../../../components/Head'
import privacyPolicy from './generated'

const PrivacyPolicy = () => (
  <>
    <Header title="Privacy Policy" description="Privacy Policy for Aidea hub" />
    <Container maxW={'5xl'}>
      <Box
        backgroundColor="white"
        p={5}
        dangerouslySetInnerHTML={{ __html: privacyPolicy }}
      />
    </Container>
  </>
)

export default PrivacyPolicy
