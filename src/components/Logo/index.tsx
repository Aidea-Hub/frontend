import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'

function Logo() {
  const user = useRecoilValue(userAtom)
  const theme = useRecoilValue(themeSelector)

  return (
    <Box
      display="inline-block"
      onClick={() => console.log('Hi')}
      as={Link}
      to="/"
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color={useColorModeValue('black', 'white')}
      >
        A
        <Box
          as="span"
          // color={useColorModeValue('white', 'black')}
          borderRadius="md"
          color={`${theme}.500`}
          // m="0.5"
          mr="2"
        >
          idea
        </Box>
        hub
        {user.is_plus && (
          <Box as="span" color={`${theme}.500`}>
            +
          </Box>
        )}
      </Text>
    </Box>
  )
}

export default Logo
