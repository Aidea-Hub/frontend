import { selector } from 'recoil'
import { userAtom } from '../atoms'

export const themeSelector = selector({
  key: 'theme',
  get: ({ get }) => {
    const { theme } = get(userAtom)
    return theme || 'purple'
  },
})
