// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

const styles = {
  global: {
    '@keyframes shimmer': {
      '0%, 100%': {
        transform: 'translateX(-30%)',
      },
      '50%': {
        transform: 'translateX(30%)',
      },
    },
  },
}

// 3. extend the theme
const theme = extendTheme({
  config,
  styles,
  colors: {
    brand: '#FF0000',
  },
})

export default theme
