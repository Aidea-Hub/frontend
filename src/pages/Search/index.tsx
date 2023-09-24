import { Box, Button, Container, Heading, Input, Text } from '@chakra-ui/react'
import keywordExtractor from 'keyword-extractor'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { stemmer } from 'stemmer'
import Header from '../../components/Head'
import { themeSelector } from '../../recoil/selectors'

export default function Search() {
  const theme = useRecoilValue(themeSelector)

  const [value, setValue] = useState('')
  const [keyword, setKeyword] = useState('')

  const handleSubmit = () => {
    const extractedKeywords = keywordExtractor.extract(value, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    })
    if (extractedKeywords.length > 0) {
      setKeyword(stemmer(extractedKeywords[0]))
      console.log(keyword)
    }
  }

  return (
    <>
      <Header
        title="Generate AI Ideas"
        description="Create AI Generated Ideas. Try it now!"
      />
      <Container maxW={'5xl'} minH={`calc(100vh - ${200}px)`}>
        <Box textAlign="center">
          <Heading as="h1" size="4xl">
            Search
          </Heading>
          <Text fontSize="lg" fontWeight="semibold" mt={2} mb={2}>
            Find specific ideas
          </Text>
          <Input
            value={value}
            onChange={event => setValue(event.target.value)}
            placeholder="Search for ideas"
          />
          <Button onClick={handleSubmit}>Search</Button>
        </Box>
      </Container>
    </>
  )
}
