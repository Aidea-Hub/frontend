import { IconButton, Tooltip } from '@chakra-ui/react'
import { FaHeart } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { useRecoilState, useRecoilValue } from 'recoil'

import authApi from '../../api/authApi'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'

interface LikeButtonProps {
  imageId: string
}

const LikeButton = ({ imageId }: LikeButtonProps) => {
  const [user, setUser] = useRecoilState(userAtom)
  const theme = useRecoilValue(themeSelector)

  const handleLike = () => {
    if (imageId && user.uid) {
      const likes = [...user.liked_images]
      const index = likes.indexOf(imageId)
      if (index !== -1) {
        // The value is already in the array, so remove it
        likes.splice(index, 1)
      } else {
        // Append the value to the end of the array
        likes.push(imageId)
      }

      setUser({
        ...user,
        liked_images: likes,
      })

      authApi.post('/likeImage', {
        imageId,
        userId: user.uid,
      })
    }
  }

  return (
    <Tooltip label="Login to Like" isDisabled={user.uid !== ''}>
      <IconButton
        isDisabled={user.uid === ''}
        colorScheme={
          user.liked_images && user.liked_images.includes(imageId)
            ? `${theme}`
            : 'black'
        }
        aria-label="like"
        variant="ghost"
        onClick={handleLike}
        icon={
          user.liked_images && user.liked_images.includes(imageId) ? (
            <FaHeart />
          ) : (
            <FiHeart />
          )
        }
      />
    </Tooltip>
  )
}

export default LikeButton
