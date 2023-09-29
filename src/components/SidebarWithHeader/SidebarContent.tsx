import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Hide,
  useColorModeValue,
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import {
  AiOutlineBook,
  AiOutlineBulb,
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineSetting,
} from 'react-icons/ai'
import { FiLogOut } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import { ROUTES } from '../../constants'
import { userAtom } from '../../recoil/atoms'
import Logo from '../Logo'
import NavItem from './NavItem'

interface LinkItemProps {
  name: string
  path: string
  icon: IconType
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', path: ROUTES.HOME, icon: AiOutlineHome },
  { name: 'Inspiration', path: ROUTES.GALLERY, icon: AiOutlineBulb },
  { name: 'Search', path: ROUTES.SEARCH, icon: AiOutlineSearch },
  { name: 'Past Ideas', path: ROUTES.PAST_IDEAS, icon: AiOutlineBook },
  { name: 'Liked', path: ROUTES.LIKED, icon: AiOutlineHeart },
  { name: 'Settings', path: ROUTES.SETTINGS, icon: AiOutlineSetting },
  { name: 'Logout', path: ROUTES.HOME, icon: FiLogOut },
]

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const resetUser = useResetRecoilState(userAtom)
  const user = useRecoilValue(userAtom)

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map(link => (
        <>
          {(link.name !== 'Logout' ||
            (link.name === 'Logout' && user.uid !== '')) && (
            <Hide
              above={link.name === 'Logout' ? 'md' : 'never'}
              key={link.name}
            >
              <Link
                to={link.path}
                onClick={() => {
                  if (link.name === 'Logout') {
                    resetUser()
                  }
                  onClose()
                }}
              >
                <NavItem icon={link.icon}>{link.name}</NavItem>
              </Link>
            </Hide>
          )}
        </>
      ))}
    </Box>
  )
}

export default SidebarContent
