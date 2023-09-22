/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Text, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { themeSelector } from '../../recoil/selectors'

interface ShimmerButtonProps {
  text: string
  bgGradient?: string
  onClick: () => void
}

export default function ShimmerButton({
  text,
  bgGradient,
  onClick,
}: ShimmerButtonProps) {
  const [buttonWidth, setButtonWidth] = useState(0)
  const [animation, SetAnimation] = useState('')
  const buttonRef = useRef(null)
  const theme = useRecoilValue(themeSelector)

  useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth((buttonRef.current as any).offsetWidth)
      SetAnimation('shimmer 5s infinite')
    }
  }, [text])

  return (
    <Button
      ref={buttonRef as any}
      position="relative"
      overflow="hidden"
      onClick={onClick}
    >
      <Box
        bgGradient={
          bgGradient || `linear(to-r, ${theme}.300, pink.400 , ${theme}.300)`
        }
        w={`${buttonWidth * 3}px`}
        h="100%"
        position="absolute"
        animation={animation}
      />
      <Text zIndex={2} color={useColorModeValue('white', 'black')}>
        {text}
      </Text>
    </Button>
  )
}
