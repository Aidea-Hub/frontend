import { Heading, Stack, Text } from '@chakra-ui/react'

export interface Contents {
  title: string
  id: string
  sections: ContentSection[]
}

export interface ContentSection {
  title: string
  id: string
  content: string
}

interface ContentProps {
  sections: Contents[]
}

const Content = ({ sections }: ContentProps) => {
  return (
    <Stack p={5} direction={"column"} h={'full'} overflow={"auto"} w={"full"} scrollBehavior={"smooth"}>
      {sections.map(section => {
        return (
          <>
            <Heading id={section.id} size={'lg'} mb={2}>{section.title}</Heading>
            {section.sections.map((s) => {
              return (
                <>
                  <Heading id={s.id} size={'md'} mb={1}>{s.title}</Heading>
                  <Text>{s.content}</Text>
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
