import { Navigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { ROUTES } from '../../constants'
import { userAtom } from '../../recoil/atoms'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProtectedRoute = ({ children }: any) => {
  const user = useRecoilValue(userAtom)
  //   const { user } = useAuth();
  if (user.uid === '') {
    // user is not authenticated
    return <Navigate to={ROUTES.LOGIN} />
  }
  return children
}
