/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useClipboard,
  useDisclosure,
} from '@chakra-ui/react'
import { FaShareAlt } from 'react-icons/fa'
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
  PocketIcon,
  PocketShareButton,
  RedditIcon,
  RedditShareButton,
  RedditShareCount,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

import { getAnalytics, logEvent } from 'firebase/analytics'
import firebase from '../../config/firebase'
const analytics = getAnalytics(firebase)

interface ShareButtonProps {
  url: string
}

const ShareButton = ({ url }: ShareButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onCopy, hasCopied } = useClipboard(url)

  const renderCount = (shareCount: number) => {
    if (!shareCount) {
      return <></>
    }
    return <Center mt={-2}>{shareCount}</Center>
  }

  return (
    <>
      <IconButton
        aria-label="Share"
        variant="ghost"
        icon={<FaShareAlt />}
        onClick={onOpen}
      ></IconButton>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share your idea</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack spacing={3}>
              <Stack h={16}>
                <RedditShareButton
                  url={url}
                  onClick={() =>
                    logEvent(analytics, 'share_idea', {
                      url: url,
                      platform: 'reddit',
                    })
                  }
                >
                  <RedditIcon size={32} round />
                </RedditShareButton>
                <Center>
                  <RedditShareCount url={url}>
                    {((shareCount: number) => renderCount(shareCount)) as any}
                  </RedditShareCount>
                </Center>
              </Stack>
              <Stack h={16}>
                <FacebookShareButton
                  url={url}
                  onClick={() =>
                    logEvent(analytics, 'share_idea', {
                      url: url,
                      platform: 'tumblr',
                    })
                  }
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>

                <FacebookShareCount url={url}>
                  {((shareCount: number) => renderCount(shareCount)) as any}
                </FacebookShareCount>
              </Stack>
              <Stack h={16}>
                <TwitterShareButton
                  url={url}
                  onClick={() =>
                    logEvent(analytics, 'share_idea', {
                      url: url,
                      platform: 'twitter',
                    })
                  }
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
              </Stack>
              <Stack h={16}>
                <PocketShareButton
                  url={url}
                  onClick={() =>
                    logEvent(analytics, 'share_idea', {
                      url: url,
                      platform: 'pocket',
                    })
                  }
                >
                  <PocketIcon size={32} round />
                </PocketShareButton>
              </Stack>
              <Stack h={16}>
                <TelegramShareButton
                  url={url}
                  onClick={() =>
                    logEvent(analytics, 'share_idea', {
                      url: url,
                      platform: 'telegram',
                    })
                  }
                >
                  <TelegramIcon size={32} round />
                </TelegramShareButton>
              </Stack>
              <Stack h={16}>
                <WhatsappShareButton
                  url={url}
                  onClick={() =>
                    logEvent(analytics, 'share_idea', {
                      url: url,
                      platform: 'whatsapp',
                    })
                  }
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              </Stack>
            </HStack>
            <Box mb={4} mt={-2}>
              <InputGroup size="md">
                <Input pr="5rem" value={url} isReadOnly />
                <InputRightElement width="5rem">
                  <Button
                    onClick={() => {
                      logEvent(analytics, 'share_idea', {
                        url: url,
                        platform: 'copied_url',
                      })
                      onCopy()
                    }}
                    h="1.75rem"
                    size="sm"
                  >
                    {hasCopied ? 'Copied' : 'Copy'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ShareButton
