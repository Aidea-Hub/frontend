'use client'

import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
} from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'
import { themeSelector } from '../../recoil/selectors'
import { useRecoilValue } from 'recoil'
import authApi from '../../api/authApi'
import { useNavigate } from 'react-router-dom'
import Stripe from "stripe";

interface Props {
  children: React.ReactNode
}

function PriceWrapper(props: Props) {
  const { children } = props
  

  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor={useColorModeValue('gray.200', 'gray.500')}
      borderRadius={'xl'}>
      {children}
    </Box>
  )
}




export function Pricing() {
  const theme = useRecoilValue(themeSelector)

  let stripe_key = process.env.STRIPE_KEY
  if (!stripe_key) {
    stripe_key = ""
  }
  const stripe = new Stripe(stripe_key, {
    apiVersion: "2023-08-16",
    typescript: true,
  });

  console.log("KEY:", stripe_key)
  
  const handler = async () => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1NvNLBFMQoAOlyFrTKBp5ES5',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'https://aidea-hub.netlify.app/success',
      cancel_url: 'https://aidea-hub.netlify.app/fail',
      automatic_tax: {enabled: true},
    })

    if (!session.url) {
      window.location.href = 'https://aidea-hub.netlify.app/fail'
    }

    const url = session.url
    window.location.href = "" + url;
  }

  return (
    <Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          Get Aidea hub+ Now!
        </Heading>
        {/* <Text fontSize="lg" color={'gray.500'}>
          Start with 14-day free trial. No credit card needed. Cancel at anytime.
        </Text> */}
      </VStack>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}>

        <PriceWrapper>
          <Box position="relative">
            <Box
              position="absolute"
              top="-16px"
              left="50%"
              
              style={{ transform: 'translate(-50%)' }}>
              <Text
                textTransform="uppercase"
                bg={'#d69e2e'}
                px={3}
                py={1}

                fontSize="sm"
                fontWeight="600"
                rounded="xl">
                Trending Hot!
              </Text>
            </Box>
            <Box py={4} px={12}>
              <Text fontWeight="500" fontSize="2xl">
                Aidea hub+
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                  $
                </Text>
                <Text fontSize="5xl" fontWeight="900">
                  4.99
                </Text>
                <Text fontSize="3xl" color="gray.500">
                  /month
                </Text>
              </HStack>
            </Box>
            <VStack
              bg={'white.100'}
              py={4}
              borderBottomRadius={'xl'}>
              <List spacing={3} textAlign="start" px={12}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={'#d69e2e'}/>
                  100 credits /month
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={'#d69e2e'} />
                  Skip the queue
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={'#d69e2e'} />
                  Voting power
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={'#d69e2e'} />
                  Exclusive feature
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={'#d69e2e'} />
                  Discord privileges
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={'#d69e2e'} />
                  My eternal gratitude
                </ListItem>
              </List>
              
              <Box w="80%" pt={7}>

                  <Button w="full" bg={'#d69e2e'} onClick={handler}>
                    Buy Now!
                  </Button>

              </Box>
            </VStack>
          </Box>
        </PriceWrapper>
      </Stack>
    </Box>
  )
}