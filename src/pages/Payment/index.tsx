'use client'

import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { CloseIcon } from '@chakra-ui/icons'

export function Success() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Payment Successful!
      </Heading>
      <Text color={'gray.500'}>
        Thank you very much for your support!
      </Text>
    </Box>
  )
}


export function Fail() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={'red.500'}
          rounded={'50px'}
          w={'55px'}
          h={'55px'}
          textAlign="center">
          <CloseIcon boxSize={'20px'} color={'white'} />
        </Flex>
      </Box>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Payment Unsuccessful!
      </Heading>
      <Text color={'gray.500'}>
        Please retry!
      </Text>
    </Box>
  )
}