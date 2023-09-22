import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import { Request } from '../../constants'
const { persistAtom } = recoilPersist()

export const requestAtom = atom<Request>({
  key: 'requestState',
  default: {
    uid: '',
    status: '',
    url: '',
    tags: [],
  },
  effects_UNSTABLE: [persistAtom],
})

export const requestCountAtom = atom<number>({
  key: 'requestCount',
  default: 0,
  effects_UNSTABLE: [persistAtom],
})
