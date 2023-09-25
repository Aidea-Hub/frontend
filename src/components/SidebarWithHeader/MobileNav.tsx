import {
  Button,
  Flex,
  FlexProps,
  Hide,
  HStack,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { FaDiscord } from 'react-icons/fa'
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
        {location.pathname !== ROUTES.GALLERY && !isPlusUser() ? (
          <>
            {location.pathname != ROUTES.GET_PLUS && (
              <ShimmerButton
                text="Get Aidea hub+"
                onClick={handleGetAideahubPlus}
              />
            )}
          </>
        ) : (
          <>
            {/* For Gallery, hide if below md */}
            {location.pathname != ROUTES.GET_PLUS && !isPlusUser() && (
              <Hide below="md">
                <ShimmerButton
                  text="Get Aidea hub+"
                  onClick={handleGetAideahubPlus}
                />
              </Hide>
            )}
          </>
        )}
      </Flex>

      <HStack spacing={{ base: '2', md: '2' }}>
        <Hide below="md">
          <IconButton
            icon={<FaDiscord />}
            as="a"
            href="https://discord.gg/w2y4huedqB"
            aria-label="Discord"
            variant="ghost"
            onClick={() => logEvent(analytics, 'header_discord')}
          />

          {/* </SocialButton> */}
        </Hide>
        {isRenderPopoverSort() && (
          <PopoverSort
            options={getSortOptions()}
            sort={getSortValue()}
            onSort={getSortHandler()}
          />
        )}
        <ColorModeSwitcher />
        <Flex alignItems={'center'}>
          <Button
            colorScheme={`${theme}`}
            onClick={() => (isLoggedIn() ? handleSignOut() : handleSignIn())}
          >
            {isLoggedIn() ? 'Sign out' : 'Login'}
          </Button>
        </Flex>
      </HStack>
    </Flex>
  )
}

export default MobileNav
