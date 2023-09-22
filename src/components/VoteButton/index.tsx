import { Flex, IconButton, Text, Tooltip } from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  IconArrowBigDown,
  IconArrowBigDownFilled,
  IconArrowBigUp,
  IconArrowBigUpFilled,
} from '@tabler/icons-react'
import { useState } from 'react'
import authApi from '../../api/authApi'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'

interface VoteButtonProps {
  imageId: string
  votes?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any
}

const VoteButton = ({ imageId, votes, image }: VoteButtonProps) => {
  // Vote functionality
  const [user, setUser] = useRecoilState(userAtom)
  const [localVotes, setLocalVotes] = useState(votes)
  const theme = useRecoilValue(themeSelector)

  const handleVote = (vote: number) => {
    console.log('handleVote Clicked', imageId, user.uid)
    let changeInVote = 0
    if (imageId && user.uid) {
      const newVotes = { ...user.votes }
      if (user.votes[imageId] && user.votes[imageId] === vote) {
        delete newVotes[imageId]
        changeInVote -= vote
      } else {
        changeInVote += 0 - (newVotes[imageId] || 0) + vote
        newVotes[imageId] = vote
      }
      setUser({
        ...user,
        votes: newVotes,
      })

      authApi.post('/voteImage', {
        imageId,
        userId: user.uid,
        vote,
      })
      console.log('changeInVote', changeInVote)
      console.log('localVotes', localVotes)
      console.log('localVotes !== undefined', localVotes !== undefined)
      if (localVotes !== undefined) {
        setLocalVotes(localVotes + changeInVote)
        if (image) {
          // normally bad practice to modify state, but since I do not need re-render, it is fine
          image.votes = localVotes + changeInVote
        }
      }
    }
  }

  return (
    <Flex align="center">
      <Tooltip label="Login to Upvote" isDisabled={user.uid !== ''}>
        <IconButton
          isDisabled={user.uid === ''}
          colorScheme={user.votes[imageId] === 1 ? `${theme}` : 'black'}
          aria-label="upvote"
          variant="ghost"
          onClick={() => handleVote(1)}
          icon={
            user.votes[imageId] === 1 ? (
              <IconArrowBigUpFilled size={20} stroke={1.5} />
            ) : (
              // eslint-disable-next-line react/jsx-no-undef
              <IconArrowBigUp size={20} stroke={1.5} />
            )
          }
        />
      </Tooltip>
      <Tooltip label="Login to Downvote" isDisabled={user.uid !== ''}>
        <IconButton
          isDisabled={user.uid === ''}
          colorScheme={user.votes[imageId] === -1 ? `${theme}` : 'black'}
          aria-label="downvote"
          variant="ghost"
          onClick={() => handleVote(-1)}
          icon={
            user.votes[imageId] === -1 ? (
              <IconArrowBigDownFilled size={20} stroke={1.5} />
            ) : (
              <IconArrowBigDown size={20} stroke={1.5} />
            )
          }
        />
      </Tooltip>
      {votes !== undefined && <Text ml={3}>{localVotes}</Text>}
    </Flex>
  )
}

export default VoteButton
