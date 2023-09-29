import {
  Box,
  Container,
  Heading,
  Icon,
  IconButton,
  Image,
  Stack,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react'
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore'
import { useState } from 'react'
import { FiRefreshCcw } from 'react-icons/fi'
import { useRecoilState, useRecoilValue } from 'recoil'
import authApi from '../../api/authApi'
import firebase from '../../config/firebase'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'

export interface Contents {
  title: string
  id: string
  sections: ContentSection[]
}

export interface ContentSection {
  title: string
  id: string
  content: JSX.Element
}

interface ContentProps {
  sections: Contents[]
  ideaId: string
  imageUrl: string
  ideaUserId: string
}

const Content = ({ sections, ideaId, imageUrl, ideaUserId }: ContentProps) => {
  const db = getFirestore(firebase)
  const { colorMode } = useColorMode()
  const theme = useRecoilValue(themeSelector)
  const [user, setUser] = useRecoilState(userAtom)
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false)
  const [image, setImage] = useState<string>(imageUrl)

  console.log('image :>> ', image);
  console.log('imageUrl :>> ', imageUrl);

  const handleRegenerateClick = async () => {
    setIsImageLoading(true)
    await authApi.post('/generateNewIdeaImage', {
      ideaId: ideaId,
      userId: user.uid,
    })
    const ideasRef = collection(db, 'ideas')

    const updatedIdea = await getDoc(doc(ideasRef, ideaId))
    setImage(updatedIdea.data()!.url)
    setIsImageLoading(false)
  }

  return (
    <Stack
      position={"relative"}
      p={5}
      direction={'column'}
      h={'full'}
      overflow={'auto'}
      w={'full'}
      scrollBehavior={'smooth'}
    >
      <Box>
        <Image
          rounded={'md'}
          src={imageUrl}
          maxH={512}
          objectFit="contain"
          fallbackSrc={`https://dummyidea.com/${512}x${768}/${
            colorMode === 'light' ? 'aaa' : 'fff'
          }/${
            colorMode === 'light' ? 'FED7D7' : 'C53030'
          }.png&text=Idea+removed+or+does+not+exist`}
          fallbackStrategy="onError"
        />
        {ideaUserId === user.uid && <Tooltip label={"Regenerate Image"}>
          <IconButton
            aria-label="regenerate image"
            position="relative"
            bottom={"50px"}
            left={5}
            icon={<Icon as={FiRefreshCcw} />}
            isRound={true}
            colorScheme={`${theme}`}
            onClick={handleRegenerateClick}
          >
            Regenerate
          </IconButton>
        </Tooltip>}
      </Box>
      {sections.map(section => {
        return (
          <>
            <Heading key={section.id} id={section.id} size={'lg'} mb={2}>
              {section.title}
            </Heading>
            {section.sections.map(s => {
              return (
                <>
                  <Heading key={`heading-${s.id}`} id={s.id} size={'md'} mb={1}>
                    {s.title}
                  </Heading>
                  <Container key={`content-${s.id}`}>{s.content}</Container>
                </>
              )
            })}
          </>
        )
      })}
    </Stack>
  )
}

export default Content
