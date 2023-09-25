import {
  Alert,
  AlertIcon,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userAtom } from '../../recoil/atoms'

import { LockIcon } from '@chakra-ui/icons'
import authApi from '../../api/authApi'
import Header from '../../components/Head'
import ThemeSelectorButtons from '../../components/ThemeSelectorButtons'
import { themeSelector } from '../../recoil/selectors'
import { NAVBAR_HEIGHT } from '../../constants'

const Settings = () => {
  const [user, setUser] = useRecoilState(userAtom)
  const [tags, setTags] = useState<string[]>(user.blacklist)
  const [isEdited, setEdited] = useState(false)
  const [isUnsavedChanges, setUnsavedChanges] = useState(false)
  const theme = useRecoilValue(themeSelector)

  const handleTagAccordianClick = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(e => e != tag))
    } else {
      setTags([...tags, tag])
    }
    setEdited(true)
    setUnsavedChanges(true)
  }

  const handleTagsInput = (newTags: string[]) => {
    setEdited(true)
    setUnsavedChanges(true)
    setTags([...newTags])
  }

  const handleClick = (colour: string) => {
    setEdited(true)
    setUnsavedChanges(true)
    setUser({ ...user, theme: colour })
  }

  const handleSave = () => {
    setUnsavedChanges(false)
    setUser({ ...user, blacklist: tags })

    authApi.post('/updateUserSettings', {
      blacklist: tags,
      theme: theme,
      userId: user.uid,
    })
  }

  const renderAlert = () => {
    if (!isEdited) {
      return <></>
    }
    return (
      <>
        {isUnsavedChanges ? (
          <Alert status="warning">
            <AlertIcon />
            Changes have not been saved.
          </Alert>
        ) : (
          <Alert status="success">
            <AlertIcon />
            Saved all changes.
          </Alert>
        )}
      </>
    )
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleBeforeUnload(e: any) {
      if (isUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleUnload(e: any) {
      if (isUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', handleUnload)
    }
  }, [isUnsavedChanges])

  return (
    <>
      <Header
        title="Settings"
        description="Configure your AI idea generation experience"
      />
      <Container maxW={'5xl'} minH={`calc(100vh - ${NAVBAR_HEIGHT}px)`}>
        <Heading mb={4}>Settings</Heading>
        {renderAlert()}
        <Divider />
        <Stack spacing={4} pt={4}>
          <HStack spacing={2}>
            <Heading>Premium Settings (Aidea hub+ Users)</Heading>
            {!user.is_plus && <LockIcon fontSize="2rem" />}
          </HStack>
          <Text fontSize="xl">Choose your theme</Text>
          <Text color={'gray.500'} fontSize={'lg'}>
            A small bonus feature as a token of appreciation for your support 😉
          </Text>
          <ThemeSelectorButtons
            onClick={handleClick}
            isDisabled={!user.is_plus}
            currentColour={user.theme || 'purple'}
          />
        </Stack>

        <Divider mt={8} />
        <Button
          size="lg"
          colorScheme={`${theme}`}
          mt="24px"
          onClick={handleSave}
          isDisabled={!isUnsavedChanges}
        >
          Save
        </Button>
      </Container>
    </>
  )
}

export default Settings
