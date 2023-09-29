import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { getAnalytics, logEvent } from 'firebase/analytics'
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import authApi from '../../api/authApi'
import firebase from '../../config/firebase'
import { NAVBAR_HEIGHT, ROUTES } from '../../constants'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'
import Content from './Content'
import ContentSidebar from './ContentSidebar'
import LinkItems from './Sections'

interface Subsection {
  title: string
  id: string
  content: any
}

const analytics = getAnalytics(firebase)

const LoadingPlaceholderContent = () => {
  const theme = useRecoilValue(themeSelector)
  return (
    <Stack direction={'row'} alignItems={'center'} my={5}>
      <CircularProgress isIndeterminate size={'20px'} color={`${theme}.400`} />
      <Text>Currently generating...</Text>
    </Stack>
  )
}

const FullIdea = () => {
  const theme = useRecoilValue(themeSelector)
  const { ideaId } = useParams()

  const content = LinkItems.map(li => {
    return {
      title: li.title,
      id: li.href.slice(1),
      sections: li.sublinks.map(sublink => {
        return {
          title: sublink.name,
          id: sublink.id,
          content: <LoadingPlaceholderContent />,
        }
      }),
    }
  })
  const db = getFirestore(firebase)

  const [sections, setSections] = useState<any[]>(content)
  const [ideaContentId, setIdeaContentId] = useState<string>('')
  const [isPublic, setIsPublic] = useState<boolean>(true)
  const [image, setImage] = useState<string>('')
  const [userIdeaId, setUserIdeaId] = useState<string>('')
  const [ideaProblem, setIdeaProblem] = useState<string>('')
  const [isChangingPublic, setIsChangingPublic] = useState<boolean>(false)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    logEvent(analytics, 'full_idea_pv', {
      ideaId: ideaId,
    })
    // Create a query against the collection.
    const ideaContentsRef = collection(db, 'idea_contents')
    const q = query(ideaContentsRef, where('idea_id', '==', ideaId))
    getDocs(q).then(querySnapshot => {
      const icId = querySnapshot.docs[0].id
      setIdeaContentId(icId)
    })

    onSnapshot(doc(collection(db, 'ideas'), ideaId), snapshot => {
      const data = snapshot.data()
      if (!data) {
        navigate(ROUTES.NOT_FOUND)
        return
      }
      setIsPublic(data.isPublic)
      setImage(data.url)
      setUserIdeaId(data.user_id)
      setIdeaProblem(data.problem)
    })
  }, [])

  useEffect(() => {
    if (!ideaContentId) {
      return
    }
    onSnapshot(
      doc(collection(db, 'idea_contents'), ideaContentId),
      snapshot => {
        const data = snapshot.data()
        if (!data) return
        const idea = data.title + ' - ' + data.description
        const newSections = sections.map(section => {
          return {
            ...section,
            sections: section.sections.map((subsection: Subsection) => {
              if (subsection.id === 'idea') {
                return {
                  ...subsection,
                  content: idea,
                }
              }
              if (!data[subsection.id]) {
                return {
                  ...subsection,
                  content: <LoadingPlaceholderContent />,
                }
              }
              return {
                ...subsection,
                content: data[subsection.id],
              }
            }),
          }
        })
        setSections(newSections)
      }
    )
  }, [ideaContentId])

  const [user, setUser] = useRecoilState(userAtom)
  const setVisbilility = async (isPublic: boolean) => {
    setIsChangingPublic(true)
    await authApi
      .put('/updateIdeaVisibility', {
        userId: user.uid,
        ideaId: ideaId,
        isPublic: isPublic,
      })
      .then(res => {
        if (res.status === 200) {
          toast({
            title: 'Successfully changed visibility.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Something went wrong.',
            description:
              'Please try again later, or contact us on Discord if the problem persists.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        }
      })
      .catch(err => {
        toast({
          title: 'Something went wrong.',
          description:
            'Please try again later, or contact us on Discord if the problem persists.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })
      .finally(() => {
        setIsChangingPublic(false)
      })
  }

  return (
    <>
      <Container maxW={'5xl'} h={`calc(100vh - ${NAVBAR_HEIGHT}px)`}>
        <Heading mb={3}>Full Idea</Heading>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="email-alerts" mb="0">
            Set idea as private?
          </FormLabel>
          <Switch
            id="idea-private"
            isDisabled={isChangingPublic}
            colorScheme={theme}
            isChecked={!isPublic}
            onChange={e => setVisbilility(!e.target.checked)}
          />
        </FormControl>
        {ideaProblem && <Box
         my={3}
         backgroundColor={`${useColorModeValue("black", "white")}Alpha.200`}
         p={5}
         borderRadius={20}
        >
          <Heading size={"xs"}>Problem from user:</Heading>
          <Text>{ideaProblem}</Text>
        </Box>}
        <div
          style={{
            marginTop: '10px',
            borderRadius: 10,
            height: '90%',
            backgroundColor: useColorModeValue('#ffffff', '#171c20'),
          }}
        >
          <Stack direction={'row'} height={'100%'}>
            <ContentSidebar />
            <Content
              sections={sections}
              ideaId={ideaId ?? ''}
              imageUrl={image}
              ideaUserId={userIdeaId}
            />
          </Stack>
        </div>
      </Container>
    </>
  )
}

export default FullIdea
