import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { FiHeart, FiHome, FiImage, FiSearch, FiSettings } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import Logo from '../Logo'
import NavItem from './NavItem'

interface LinkItemProps {
  name: string
  path: string
  icon: IconType
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', path: ROUTES.HOME, icon: FiHome },
  { name: 'Gallery', path: ROUTES.GALLERY, icon: FiImage },
  { name: 'Liked', path: ROUTES.LIKED, icon: FiHeart },
  { name: 'Search', path: ROUTES.SEARCH, icon: FiSearch },
  { name: 'Settings', path: ROUTES.SETTINGS, icon: FiSettings },
]

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
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
        <Link to={link.path} key={link.name} onClick={onClose}>
          <NavItem icon={link.icon}>{link.name}</NavItem>
        </Link>
      ))}
    </Box>
  )
}

export default SidebarContent
