import { Heading, Stack, Text } from '@chakra-ui/react'

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
}

const Content = ({ sections }: ContentProps) => {
  return (
    <Stack
      p={5}
      direction={'column'}
      h={'full'}
      overflow={'auto'}
      w={'full'}
      scrollBehavior={'smooth'}
    >
      {sections.map(section => {
        return (
          <>
            <Heading key={section.id} id={section.id} size={'xl'} mb={2}>
              {section.title}
            </Heading>
            {section.sections.map(s => {
              return (
                <>
                  <br />
                  <Heading key={`heading-${s.id}`} id={s.id} size={'lg'} mb={1}>
                    {s.title}
                  </Heading>
                  <br />
                  <Text
                    size={'lg'}
                    key={`content-${s.id}`}
                    whiteSpace="pre-line"
                    my={2}
                  >
                    {s.content}
                  </Text>{' '}
                  <br />
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
