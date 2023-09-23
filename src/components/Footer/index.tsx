import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { ReactNode } from 'react'
import { FaDiscord, FaReddit } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import firebase from '../../config/firebase'
import { ROUTES } from '../../constants'

const analytics = getAnalytics(firebase)

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode
  label: string
  href: string
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
      onClick={() => logEvent(analytics, 'footer_' + label.toLowerCase())}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  )
}

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.200', 'gray.800')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt={2}
      as="footer"
    >
      <Container
        as={Stack}
        maxW={'5xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2023 Aidea hub. All rights reserved</Text>
        <Link to={ROUTES.COOKIES}>Cookies Policy</Link>
        <Link to={ROUTES.PRIVACY}>Privacy Policy</Link>
        <Link to={ROUTES.TOS}>Terms of Service</Link>
        <Stack direction={'row'} spacing={6}>
          <SocialButton
            label={'Discord'}
            href={'https://discord.gg/w2y4huedqB'}
          >
            <FaDiscord />
          </SocialButton>
          <SocialButton
            label={'Reddit'}
            href={'https://www.reddit.com/r/aideahub/'}
          >
            <FaReddit />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  )
}
