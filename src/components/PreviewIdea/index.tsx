/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore'
import { useState } from 'react'
import { FiRefreshCcw } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import authApi from '../../api/authApi'
import firebase from '../../config/firebase'
import { ROUTES } from '../../constants'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'
import LikeButton from '../LikeButton'
import PulsingDot from '../PulsingDot'
import SelectedTagList from '../SelectedTagList'
import ShareButton from '../ShareButton'
import VoteButton from '../VoteButton'
interface PreviewIdeaProps {
  isOpen: boolean
  onClose: any
  post: any
  isGeneratedIdea?: boolean,
}
const db = getFirestore(firebase)

export default function PreviewIdea({
  isOpen,
  onClose,
  post: idea,
  isGeneratedIdea,
}: PreviewIdeaProps) {
  const size = useBreakpointValue({ base: 'md', md: 'xl' })
  const { colorMode } = useColorMode()
  const [isLoading, setLoading] = useState(false)
  const navigate = useNavigate()
  const user = useRecoilValue(userAtom)
  const theme = useRecoilValue(themeSelector)

  const handleRegenerateClick = async () => {
    setLoading(true)
    await authApi.post('/generateNewIdeaImage', {
      ideaId: idea.id,
      userId: user.uid,
    })
    const ideasRef = collection(db, 'ideas')

    const updatedIdea = await getDoc(doc(ideasRef, idea.id))
    idea.url = updatedIdea.data()!.url
    setLoading(false)
  }

  return (
    <Modal
      isCentered
      scrollBehavior="inside"
      size={size}
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Center>
            <Stack mt={10} maxWidth={512}>
              <Box position="relative">
                {!isGeneratedIdea && <Image
                  rounded={'md'}
                  src={idea.url}
                  maxH={512}
                  objectFit="contain"
                  fallbackSrc={`https://dummyidea.com/${512}x${768}/${
                    colorMode === 'light' ? 'aaa' : 'fff'
                  }/${
                    colorMode === 'light' ? 'FED7D7' : 'C53030'
                  }.png&text=Idea+removed+or+does+not+exist`}
                  fallbackStrategy="onError"
                />}
                {isLoading && (
                  <>
                    <Center
                      position="absolute"
                      top={0}
                      right={0}
                      bottom={0}
                      left={0}
                    >
                      <PulsingDot />
                    </Center>
                    <Box
                      position="absolute"
                      top={0}
                      right={0}
                      bottom={0}
                      left={0}
                      bgColor="rgba(0, 0, 0, 0.4)" // Semi-transparent gray
                    ></Box>
                  </>
                )}
                {user.uid === idea.user_id && (
                  <IconButton
                    aria-label="regenerate image"
                    position="absolute"
                    bottom={2}
                    right={2}
                    icon={<Icon as={FiRefreshCcw} />}
                    isRound={true}
                    colorScheme={`${theme}`}
                    onClick={handleRegenerateClick}
                  >
                    Regenerate
                  </IconButton>
                )}
              </Box>
              {!isGeneratedIdea && <Flex
                px="2"
                py="2"
                align="center"
                justify="space-between"
                w="100%"
              >
                <VoteButton ideaId={idea.id} votes={idea.votes} idea={idea} />

                <Flex align="center">
                  <ShareButton
                    url={`${window.location.protocol}//${window.location.host}${ROUTES.FULL_IDEA_BASE}/${idea.id}`}
                  />
                  <LikeButton ideaId={idea.id} />
                  <Text ml={1}>
                    {idea.created_at &&
                      new Date(
                        idea.created_at.seconds * 1000
                      ).toLocaleDateString()}
                  </Text>
                </Flex>
              </Flex>}
              <Heading marginTop="1" size="lg" px={2}>
                <Text textDecoration="none" maxWidth="100%">
                  {idea.title}
                </Text>
              </Heading>
              <Text
                px={2}
                as="p"
                marginTop="2"
                color={useColorModeValue('gray.700', 'gray.200')}
                fontSize="lg"
                maxWidth="100%"
              >
                {idea.description}
              </Text>
              {!isGeneratedIdea && idea.tags && <Text>Tags: </Text>}
              {!isGeneratedIdea && (idea.tags && idea.tags.length == 0 ? (
                <Text>No Tags </Text>
              ) : (
                <>
                  {idea.tags && (
                    <SelectedTagList
                      tags={idea.tags}
                      isDisabled
                      onClick={
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        () => {}
                      }
                    />
                  )}
                </>
              ))}
            </Stack>
          </Center>
        </ModalBody>
        <ModalFooter>
          {!isGeneratedIdea && <Button
            onClick={() => {
              navigate(`${ROUTES.FULL_IDEA_BASE}/${idea.id}`)
            }}
          >
            View Full
          </Button>}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
