import {
  CircularProgress,
  Container,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import firebase from '../../config/firebase'
import { NAVBAR_HEIGHT } from '../../constants'
import Content from './Content'
import ContentSidebar from './ContentSidebar'
import LinkItems from './Sections'

interface Subsection {
  title: string
  id: string
  content: any
}

const LoadingPlaceholderContent = () => (
  <Stack direction={'row'} alignItems={'center'} my={5}>
    <CircularProgress isIndeterminate size={'20px'} />
    <Text>Currently generating...</Text>
  </Stack>
)

const FullIdea = () => {
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

  useEffect(() => {
    // Create a query against the collection.
    const ideaContentsRef = collection(db, "idea_contents");
    const q = query(ideaContentsRef, where("idea_id", "==", ideaId));
    getDocs(q).then((querySnapshot) => {
      const icId = querySnapshot.docs[0].id;
      setIdeaContentId(icId)
    });
  }, [])

  useEffect(() => {
    if (!ideaContentId) {
      return
    }
    onSnapshot(
      doc(collection(db, 'idea_contents'), ideaContentId),
      snapshot => {
        const data = snapshot.data()
        console.log('data :>> ', data);
        if (!data) return
        const idea = data.title + " - " + data.description
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

  return (
    <>
      <Container maxW={'5xl'} h={`calc(100vh - ${NAVBAR_HEIGHT}px)`}>
        <Heading mb={3}>Full Idea</Heading>
        <div
          style={{
            borderRadius: 10,
            height: '90%',
            backgroundColor: useColorModeValue('#ffffff', '#171c20'),
          }}
        >
          <Stack direction={'row'} height={'100%'}>
            <ContentSidebar />
            <Content sections={sections} />
          </Stack>
        </div>
      </Container>
    </>
  )
}

export default FullIdea
