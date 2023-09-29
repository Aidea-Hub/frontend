import { Center, Container } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import Header from '../../components/Head'

import PulsingDot from '../../components/PulsingDot'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'
import { NAVBAR_HEIGHT } from '../../constants'

export default function ViewIdea() {
  const { is_plus } = useRecoilValue(userAtom)
  const theme = useRecoilValue(themeSelector)
  const isLoading = true

  return (
    <>
      <Header title="View Idea" description="View and Edit a generated idea" />
      <Container flex={1} maxW="5xl" minH={`calc(100vh - ${NAVBAR_HEIGHT}px)`}>
        {isLoading ? <PulsingDot /> : <Center>Placeholder</Center>}
      </Container>
    </>
  )
}
