import { Container, Heading, Stack } from '@chakra-ui/react'

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
            <Heading key={section.id} id={section.id} size={'lg'} mb={2}>
              {section.title}
            </Heading>
            {section.sections.map(s => {
              return (
                <>
                  <Heading key={`heading-${s.id}`} id={s.id} size={'md'} mb={1}>
                    {s.title}
                  </Heading>
                  <Container key={`content-${s.id}`} >{s.content}</Container>
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
