'use client'

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

// Replace test data with your own
// const features = [...Array(4)].map((x, i) => ({
//   id: i,
//   title: 'Lorem ipsum dolor sit amet',
//   text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.',
// }));

const features = [
  {
    id: 0,
    title: "Proven and Tested Project Ideation Framework",
    text: "Aidea Hub offers a trusted ideation framework developed with input from industry experts.",
  },
  {
    id: 1,
    title: "Effortless Idea Generation",
    text: "Aidea Hub leverages AI to simplify idea generation, covering all key project aspects with a single prompt.",
  },
  {
    id: 2,
    title: "Idea Inspiration & Sharing",
    text: "Aidea Hub fosters creativity with idea sharing and a voting system for popular concepts.",
  }
]


export function Feature() {
  return (
    <Box p={4}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
        <Heading fontSize={'3xl'}>Our Features</Heading>
        {/* <Text color={'gray.600'} fontSize={'xl'}>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
          tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
        </Text> */}
      </Stack>

      <Container maxW={'6xl'} mt={10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {features.map((feature) => (
            <HStack key={feature.id} align={'top'}>
              <Box color={'#d69e2e'} px={2}>
                <Icon as={CheckIcon} />
              </Box>
              <VStack align={'start'}>
                <Text fontWeight={600}>{feature.title}</Text>
                <Text color={'gray.500'}>{feature.text}</Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}