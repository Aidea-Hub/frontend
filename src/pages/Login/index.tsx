import {
  Box,
  Container,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import GoogleLoginButton from '../../components/GoogleLoginButton'
import Header from '../../components/Head'
import { NAVBAR_HEIGHT, ROUTES } from '../../constants'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'

const options = [
  { id: 1, desc: 'Unlimited idea generation' },
  { id: 2, desc: 'Vote and like ideas' },
  { id: 3, desc: 'Browse your liked ideas' },
  { id: 4, desc: 'Sync your settings' },
]

export default function Login() {
  const user = useRecoilValue(userAtom)
  const navigate = useNavigate()
  const theme = useRecoilValue(themeSelector)

  useEffect(() => {
    // Already logged in
    if (user && user.uid !== '') {
      navigate(ROUTES.HOME)
    }
  }, [user])

  return (
    <>
      <Header
        title="Login"
        description="Login to access more features for Aidea hub"
      />
      <Container flex={1} maxW="5xl" minH={`calc(100vh - ${NAVBAR_HEIGHT}px)`}>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          {/* <Flex minH={'100vh'} align={'center'} justify={'center'}> */}
          <Stack spacing={8} mx={'auto'} maxW={'lg'}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'}>Sign in to your account</Heading>
              <Text fontSize={'lg'}>
                to enjoy all of our features:
                <List pt={2} spacing={1} textAlign="start">
                  {options.map(desc => (
                    <ListItem key={desc.id}>
                      <ListIcon as={FaCheckCircle} color={`${theme}.500`} />
                      {desc.desc}
                    </ListItem>
                  ))}
                </List>
              </Text>
            </Stack>
            <Stack spacing={4}>
              <GoogleLoginButton />
            </Stack>

            <Text as="span">
              By signing-in, you agree with our{' '}
              <Text as="u">
                <Link to={ROUTES.TOS}>Terms of Service</Link>
              </Text>{' '}
              and{' '}
              <Text as="u">
                <Link to={ROUTES.PRIVACY}>Privacy Policy</Link>
              </Text>
            </Text>
          </Stack>
          {/* </Flex> */}
        </Box>
      </Container>
    </>
  )
}
