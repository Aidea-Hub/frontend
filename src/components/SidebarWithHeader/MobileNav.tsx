import {
  Button,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  useColorModeValue,
  useMediaQuery,
  useTheme,
} from '@chakra-ui/react'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { FiMenu } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import firebase from '../../config/firebase'
import { ROUTES } from '../../constants'
import { GallerySortOptions } from '../../pages/Gallery'
import { LikedSortOptions } from '../../pages/Liked'
import { gallerySortAtom, likedSortAtom, userAtom } from '../../recoil/atoms'
import { themeSelector } from '../../recoil/selectors'
import { ColorModeSwitcher } from '../ColorModeSwitcher'
import PopoverSort from '../PopoverSort'
import ShimmerButton from '../ShimmerButton'

interface MobileProps extends FlexProps {
  onOpen: () => void
}

const analytics = getAnalytics(firebase)

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const chakraTheme = useTheme()
  const [isBelowMD] = useMediaQuery(
    `(max-width: ${chakraTheme.breakpoints.md})`
  )

  const isRenderPopoverSort = () =>
    location.pathname == ROUTES.GALLERY ||
    location.pathname == ROUTES.LIKED ||
    location.pathname == ROUTES.PAST_IDEAS ||
    location.pathname == ROUTES.SEARCH

  const [gallerySort, setGallerySort] = useRecoilState(gallerySortAtom)

  const [likedSort, setLikedSort] = useRecoilState(likedSortAtom)
  const theme = useRecoilValue(themeSelector)

  const getSortOptions = () => {
    if (
      location.pathname == ROUTES.GALLERY ||
      location.pathname == ROUTES.PAST_IDEAS ||
      location.pathname == ROUTES.SEARCH
    ) {
      return GallerySortOptions
    } else {
      // assumes location.pathname == ROUTES.LIKED
      return LikedSortOptions
    }
  }

  const getSortValue = () => {
    if (location.pathname == ROUTES.LIKED) {
      return likedSort
    } else {
      return gallerySort
    }
  }

  const getSortHandler = () => {
    if (location.pathname == ROUTES.LIKED) {
      return setLikedSort
    } else {
      return setGallerySort
    }
  }

  const user = useRecoilValue(userAtom)
  const resetUser = useResetRecoilState(userAtom)

  const isLoggedIn = () => {
    return user.uid !== ''
  }

  const isPlusUser = () => {
    return user.is_plus
  }

  const handleSignIn = () => {
    navigate(ROUTES.LOGIN)
  }

  const handleSignOut = () => {
    // googleLogout()
    resetUser()
  }

  const isRenderIsPlusButton = () => {
    return (
      (location.pathname != ROUTES.GET_PLUS &&
        location.pathname != ROUTES.PAST_IDEAS &&
        location.pathname != ROUTES.SEARCH &&
        location.pathname != ROUTES.LIKED &&
        location.pathname != ROUTES.GALLERY &&
        isLoggedIn()) ||
      !isBelowMD
    )
  }

  const isRenderLoginButton = () => {
    return (
      (location.pathname != ROUTES.PAST_IDEAS &&
        location.pathname != ROUTES.SEARCH &&
        location.pathname != ROUTES.LIKED &&
        location.pathname != ROUTES.GALLERY) ||
      !isBelowMD
    )
  }

  const handleGetAideahubPlus = () => {
    logEvent(analytics, 'get_aideahub_plus', {
      from_page: location.pathname,
    })
    navigate(`${ROUTES.GET_PLUS}`)
  }
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="10"
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Flex flex={1} ml={5}>
        {!isPlusUser() && (
          <>
            {isRenderIsPlusButton() && (
              <ShimmerButton
                text="Get Aidea hub+"
                onClick={handleGetAideahubPlus}
              />
            )}
          </>
        )}
      </Flex>

      <HStack spacing={{ base: '2', md: '2' }}>
        {/* <Hide below="md">
          <IconButton
            icon={<FaDiscord />}
            as="a"
            href="https://discord.gg/w2y4huedqB"
            aria-label="Discord"
            variant="ghost"
            onClick={() => logEvent(analytics, 'header_discord')}
          />
        </Hide> */}
        {isRenderPopoverSort() && (
          <PopoverSort
            options={getSortOptions()}
            sort={getSortValue()}
            onSort={getSortHandler()}
          />
        )}
        <ColorModeSwitcher />
        {isRenderLoginButton() && (
          <Flex alignItems={'center'}>
            {isLoggedIn() && !isBelowMD ? (
              <Button colorScheme={`${theme}`} onClick={handleSignOut}>
                Sign out
              </Button>
            ) : !isLoggedIn() ? (
              <Button colorScheme={`${theme}`} onClick={handleSignIn}>
                Login
              </Button>
            ) : null}
          </Flex>
        )}
      </HStack>
    </Flex>
  )
}

export default MobileNav
