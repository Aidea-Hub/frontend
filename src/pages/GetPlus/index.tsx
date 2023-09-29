import Stripe from "stripe";
import {
  Box,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  Button
} from '@chakra-ui/react'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { ReactElement, useEffect } from 'react'
import {
  FcCollaboration,
  FcEditImage,
  FcExternal,
  FcLike,
  FcMultipleInputs,
} from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import Header from '../../components/Head'
import ShimmerButton from '../../components/ShimmerButton'
import firebase from '../../config/firebase'
import { ROUTES } from '../../constants'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'

interface FeatureCardProps {
  heading: string
  description: string
  icon: ReactElement
  href: string
}
const analytics = getAnalytics(firebase)

const FeatureCard = ({
  heading,
  description,
  icon,
  href,
}: FeatureCardProps) => {
  return (
    <Box
      maxW={{ base: 'full', md: '275px' }}
      w={'full'}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
    >
      <Stack align={'start'} spacing={2}>
        <Flex
          w={16}
          h={16}
          align={'center'}
          justify={'center'}
          color={'white'}
          rounded={'full'}
          bg={useColorModeValue('gray.100', 'gray.700')}
        >
          {icon}
        </Flex>
        <Box mt={2}>
          <Heading size="md">{heading}</Heading>
          <Text mt={1} fontSize={'sm'}>
            {description}
          </Text>
        </Box>
        {/* <Button variant={'link'} colorScheme={'blue'} size={'sm'}>
          Learn more
        </Button> */}
      </Stack>
    </Box>
  )
}

// const options = [
//   { id: 1, desc: 'Top priority in idea generation and all other queues' },
//   {
//     id: 2,
//     desc: 'Editing of ideas (currently in progress, basic edit functionality will be released by 6th May 2023)',
//   },
//   { id: 3, desc: 'Discord Priviliges (Feature Voting, etc.)' },
//   { id: 4, desc: 'Bonus Settings (Setting themes)' },
// ]


const stripe_key = process.env.REACT_APP_STRIPE_KEY || ""
const stripe = new Stripe(stripe_key, {
  apiVersion: "2023-08-16",
  typescript: true,
});


export default function GetPlus() {
  const user = useRecoilValue(userAtom)
  const navigate = useNavigate()
  const theme = useRecoilValue(themeSelector)
  const stripe_link = process.env.REACT_APP_CLOUD_FUNCTION_PROD_URL + "createCheckoutSession"


  useEffect(() => {
    // Already logged in
    if (user && user.is_plus) {
      navigate(ROUTES.HOME)
    }
  }, [user])

  const handleNavigatToPatreon = () => {
    logEvent(analytics, 'get_plus_to_patreon')
    window.location.href = 'https://patreon.com/Aidea hub'
  }

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
    <>
      <Header
        title="Get Aidea hub+"
        description="Upgrade to access full functionality for Aidea hub"
      />
      <Container flex={1} maxW="5xl" minH={`calc(100vh - ${200}px)`}>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={{ base: '2xl', sm: '4xl' }} fontWeight={'bold'}>
            Upgrade to Aidea hub+
          </Heading>
          <Text fontSize={{ base: 'sm', sm: 'lg' }}>
            Enjoy prirority and full access to all functionality in Aidea hub
          </Text>
          <ShimmerButton
            text="Get Aidea hub+ now"
            onClick={handler}
          />
          {/* <form action={stripe_link} method="POST">
            <ShimmerButton
              text="Get Aidea hub+ now"
              onClick={handleNavigatToPatreon}
            />
          </form> */}

        </Stack>

        <Container maxW={'5xl'} mt={12}>
          <Flex flexWrap="wrap" gridGap={6} justify="center">
            <FeatureCard
              heading={'Skip the queue'}
              // FcAdvance
              icon={<Icon as={FcExternal} w={10} h={10} />}
              description={
                'Top priority in all generation requests. Skip the queue!'
              }
              href={'#'}
            />
            <FeatureCard
              heading={'Voting Power'}
              icon={<Icon as={FcMultipleInputs} w={10} h={10} />}
              description={
                'Vote for new features you want to see and control the direction Aidea hub gets developed.'
              }
              href={'#'}
            />
            <FeatureCard
              heading={'Exclusive Features'}
              icon={<Icon as={FcEditImage} w={10} h={10} />}
              description={
                'Early access for new features and exlusive access to features such as editing ideas and themes.'
              }
              href={'#'}
            />
            <FeatureCard
              heading={'Discord Privileges'}
              icon={<Icon as={FcCollaboration} w={10} h={10} />}
              description={'Exclusive Discord roles and channel access.'}
              href={'#'}
            />
            <FeatureCard
              heading={'My eternal gratitude'}
              icon={<Icon as={FcLike} w={10} h={10} />}
              description={
                'Help cover server costs and ensure we can continue investing time into developing new features.'
              }
              href={'#'}
            />
          </Flex>
        </Container>
      </Container>
    </>
  )
}
