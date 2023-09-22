import { Wrap, WrapItem } from '@chakra-ui/layout'
import { Tag, TagCloseButton, TagLabel } from '@chakra-ui/tag'
import { useRecoilValue } from 'recoil'
import { themeSelector } from '../../recoil/selectors'

interface SelectedTagListProps {
  tags: string[]
  onClick: (tag: string) => void
  isDisabled?: boolean
}

const SelectedTagList = ({
  tags,
  onClick,
  isDisabled = false,
}: SelectedTagListProps) => {
  const theme = useRecoilValue(themeSelector)

  const renderTags = () =>
    tags.map(tag => {
      return (
        <WrapItem key={tag}>
          <Tag
            size={'md'}
            borderRadius="full"
            variant="outline"
            colorScheme={`${theme}`}
          >
            <TagLabel>{tag}</TagLabel>
            {!isDisabled && <TagCloseButton onClick={() => onClick(tag)} />}
          </Tag>
        </WrapItem>
      )
    })

  return (
    <Wrap spacing="2" align="center">
      {renderTags()}
    </Wrap>
  )
}

export default SelectedTagList
