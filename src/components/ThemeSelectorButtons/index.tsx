import { Button, Wrap, WrapItem } from '@chakra-ui/react'

interface ThemeSelectorButtonsProps {
  isDisabled: boolean
  onClick: (colour: string) => void
  currentColour: string
}

const ThemeSelectorButtons = ({
  isDisabled,
  onClick,
  currentColour,
}: ThemeSelectorButtonsProps) => {
  const colours = [
    'gray',
    'red',
    'orange',
    'yellow',
    'green',
    'teal',
    'blue',
    'cyan',
    'purple',
    'pink',
  ]

  const getColourButtons = () => {
    return colours.map(colour => (
      <WrapItem key={colour}>
        <Button
          colorScheme={colour}
          isDisabled={isDisabled}
          onClick={() => onClick(colour)}
          variant={colour === currentColour ? 'outline' : 'solid'}
        >
          {colour[0].toUpperCase() + colour.slice(1)}
        </Button>
      </WrapItem>
    ))
  }

  return (
    <>
      <Wrap spacing={4}>{getColourButtons()}</Wrap>
    </>
  )
}

export default ThemeSelectorButtons
