import {
  Button,
  Highlight,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import firebase from '../../config/firebase'
import { ROUTES } from '../../constants'
import { themeSelector } from '../../recoil/selectors'
interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const analytics = getAnalytics(firebase)

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const navigate = useNavigate()
  const theme = useRecoilValue(themeSelector)

  const handleClick = () => {
    logEvent(analytics, 'redirect_to_login')
    navigate(ROUTES.LOGIN)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login to continue</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text lineHeight="tall">
            <Highlight
              query={['unlimited', 'free']}
              styles={{
                color: `${theme}.500`,
                fontWeight: 'bold',
              }}
            >
              Please login to enjoy continued access to unlimited and free
              generation of ideas.
            </Highlight>
          </Text>
          <Text mt={4}>Thank you for supporting Aidea hub!</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme={`${theme}`} mr={3} onClick={() => handleClick()}>
            Login
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LoginModal
