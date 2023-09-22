import { Center, Container } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import Header from '../../components/Head'

import PulsingDot from '../../components/PulsingDot'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'

export default function ViewImage() {
  const { is_plus } = useRecoilValue(userAtom)
  const theme = useRecoilValue(themeSelector)
  const isLoading = true

  return (
    <>
      <Header
        title="View Image"
        description="View and Edit a generated image"
      />
      <Container flex={1} maxW="5xl" minH={`calc(100vh - ${200}px)`}>
        {isLoading ? <PulsingDot /> : <Center>Placeholder</Center>}
      </Container>
    </>
  )
}
