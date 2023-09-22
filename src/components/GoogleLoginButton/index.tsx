/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, Center, Text } from '@chakra-ui/react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { FcGoogle } from 'react-icons/fc'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useResetRecoilState } from 'recoil'
import authApi from '../../api/authApi'
import firebase from '../../config/firebase'
import { ROUTES } from '../../constants'
import { userAtom } from '../../recoil/atoms'

interface LoginUser {
  name: string
  blacklist: string[]
  email: string
  uid: string
}

const GoogleLoginButton = () => {
  const [user, setUser] = useRecoilState(userAtom)
  const navigate = useNavigate()

  const auth = getAuth(firebase)

  const resetUser = useResetRecoilState(userAtom)

  const { isLoading, mutate } = useMutation({
    mutationFn: async (user: LoginUser) => {
      return authApi.post('/login', user)
    },
    onSuccess: resp => {
      setUser(resp.data.data)
      navigate(ROUTES.HOME)
    },
  })

  const googleProvider = new GoogleAuthProvider()
  const signInWithGoogle = async () => {
    // to avoid conflict with blacklist tags
    resetUser()
    try {
      const res = await signInWithPopup(auth, googleProvider)
      const toLogin = res.user
      mutate({
        name: toLogin.displayName!,
        blacklist: user.blacklist,
        email: toLogin.email!,
        uid: toLogin.uid,
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Button
      isLoading={isLoading}
      w={'full'}
      variant={'outline'}
      leftIcon={<FcGoogle />}
      onClick={() => signInWithGoogle()}
    >
      <Center>
        <Text>Sign in with Google</Text>
      </Center>
    </Button>
  )
}

export default GoogleLoginButton
