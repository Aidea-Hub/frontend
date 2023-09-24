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
  ideaId: string
  votes?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  idea?: any
}

const VoteButton = ({ ideaId, votes, idea }: VoteButtonProps) => {
  // Vote functionality
  const [user, setUser] = useRecoilState(userAtom)
  const [localVotes, setLocalVotes] = useState(votes)
  const theme = useRecoilValue(themeSelector)

  const handleVote = (vote: number) => {
    console.log('handleVote Clicked', ideaId, user.uid)
    let changeInVote = 0
    if (ideaId && user.uid) {
      const newVotes = { ...user.votes }
      if (user.votes[ideaId] && user.votes[ideaId] === vote) {
        delete newVotes[ideaId]
        changeInVote -= vote
      } else {
        changeInVote += 0 - (newVotes[ideaId] || 0) + vote
        newVotes[ideaId] = vote
      }
      setUser({
        ...user,
        votes: newVotes,
      })

      authApi.post('/voteIdea', {
        ideaId,
        userId: user.uid,
        vote,
      })
      console.log('changeInVote', changeInVote)
      console.log('localVotes', localVotes)
      console.log('localVotes !== undefined', localVotes !== undefined)
      if (localVotes !== undefined) {
        setLocalVotes(localVotes + changeInVote)
        if (idea) {
          // normally bad practice to modify state, but since I do not need re-render, it is fine
          idea.votes = localVotes + changeInVote
        }
      }
    }
  }

  return (
    <Flex align="center">
      <Tooltip label="Login to Upvote" isDisabled={user.uid !== ''}>
        <IconButton
          isDisabled={user.uid === ''}
          colorScheme={user.votes[ideaId] === 1 ? `${theme}` : 'black'}
          aria-label="upvote"
          variant="ghost"
          onClick={e => {
            e.stopPropagation()
            handleVote(1)
          }}
          icon={
            user.votes[ideaId] === 1 ? (
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
          colorScheme={user.votes[ideaId] === -1 ? `${theme}` : 'black'}
          aria-label="downvote"
          variant="ghost"
          onClick={e => {
            e.stopPropagation()
            handleVote(-1)
          }}
          icon={
            user.votes[ideaId] === -1 ? (
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
