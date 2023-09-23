import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { FaSort } from 'react-icons/fa'
import { useRecoilValue } from 'recoil'
import { themeSelector } from '../../recoil/selectors'

interface PopoverSortProps {
  options: { name: string; value: string }[]
  sort: string
  onSort: (sort: string) => void
}

const PopoverSort = ({ options, sort, onSort }: PopoverSortProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const firstFieldRef = React.useRef(null)
  const theme = useRecoilValue(themeSelector)

  const handleSort = (sort: string) => {
    onSort(sort)
  }

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={firstFieldRef}
      onOpen={onOpen}
      onClose={onClose}
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <IconButton icon={<FaSort />} aria-label="Filter" variant="ghost" />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>Sort by</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <RadioGroup onChange={handleSort} value={sort}>
              <Stack>
                {options.map(option => (
                  <Radio
                    key={option.value}
                    value={option.value}
                    colorScheme={`${theme}`}
                  >
                    {option.name}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default PopoverSort
