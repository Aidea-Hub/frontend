import { IconButton, Tooltip } from '@chakra-ui/react'
import { FaHeart } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { useRecoilState, useRecoilValue } from 'recoil'

import authApi from '../../api/authApi'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'

interface LikeButtonProps {
  ideaId: string
}

const LikeButton = ({ ideaId }: LikeButtonProps) => {
  const [user, setUser] = useRecoilState(userAtom)
  const theme = useRecoilValue(themeSelector)

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (ideaId && user.uid) {
      const likes = [...user.liked_ideas]
      const index = likes.indexOf(ideaId)
      if (index !== -1) {
        // The value is already in the array, so remove it
        likes.splice(index, 1)
      } else {
        // Append the value to the end of the array
        likes.push(ideaId)
      }

      setUser({
        ...user,
        liked_ideas: likes,
      })

      authApi.post('/likeIdea', {
        ideaId,
        userId: user.uid,
      })
    }
  }

  return (
    <Tooltip label="Login to Like" isDisabled={user.uid !== ''}>
      <IconButton
        isDisabled={user.uid === ''}
        colorScheme={
          user.liked_ideas && user.liked_ideas.includes(ideaId)
            ? `${theme}`
            : 'black'
        }
        aria-label="like"
        variant="ghost"
        onClick={handleLike}
        icon={
          user.liked_ideas && user.liked_ideas.includes(ideaId) ? (
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
