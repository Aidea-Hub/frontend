/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Center,
  Flex,
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
} from '@chakra-ui/react'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants'
import LikeButton from '../LikeButton'
import SelectedTagList from '../SelectedTagList'
import ShareButton from '../ShareButton'
import VoteButton from '../VoteButton'
interface PreviewIdeaProps {
  isOpen: boolean
  onClose: any
  post: any
}

export default function PreviewIdea({
  isOpen,
  onClose,
  post: idea,
}: PreviewIdeaProps) {
  const size = useBreakpointValue({ base: 'md', md: 'xl' })
  const { colorMode } = useColorMode()
  const navigate = useNavigate()

  // TODO change to tags length
  //const ideaMarginTop = !post.awards.length ? 3 : 0

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
              <Image
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
              />
              <Flex
                px="4"
                py="2"
                align="center"
                justify="space-between"
                w="100%"
              >
                <VoteButton ideaId={idea.id} votes={idea.votes} idea={idea} />

                <Flex align="center">
                  <IconButton
                    aria-label="Share"
                    variant="ghost"
                    icon={<FaEdit />}
                    onClick={() => {
                      navigate(`${ROUTES.VIEW}/${idea.id}`)
                    }}
                  ></IconButton>
                  <ShareButton url={idea.url} />
                  <LikeButton ideaId={idea.id} />
                  {/* <Text ml={1}>
                    {idea.created_at &&
                      new Date(
                        idea.created_at.seconds * 1000
                      ).toLocaleDateString()}
                  </Text> */}
                </Flex>
              </Flex>
              {idea.tags && <Text>Tags: </Text>}
              {idea.tags && idea.tags.length == 0 ? (
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
              )}
            </Stack>
          </Center>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
