import { atom } from 'recoil'

export const selectedTagAtom = atom<string>({
  key: 'selectedTag',
  default: '',
})

export const gallerySortAtom = atom<string>({
  key: 'gallerySort',
  default: 'created_at-desc',
})

export const likedSortAtom = atom<string>({
  key: 'likedSort',
  default: 'liked_at-desc',
})
