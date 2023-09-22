import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import { User } from '../../constants'

const { persistAtom } = recoilPersist()

export const userAtom = atom<User>({
  key: 'user',
  default: {
    name: '',
    blacklist: [],
    email: '',
    uid: '',
    is_plus: false,
    liked_images: [],
    votes: {},
    theme: 'yellow',
  },
  effects_UNSTABLE: [persistAtom],
})
