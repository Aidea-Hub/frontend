import { Timestamp } from 'firebase/firestore'

export const getCDNUrl = (imageId: string) => {
  return 'https://picsum.photos/seed/picsum/' + imageId + '/200/300'
}

export interface Request {
  uid: string
  status?: string
  url?: string
  tags?: string[]
}
export const getImageIdFromUrl = (url: string): string => {
  const pathSegments = url.split('/')
  const imageNameWithExtension = pathSegments[pathSegments.length - 1]
  // Split the image name by '.' to get an array of name and extension
  const imageNameSegments = imageNameWithExtension.split('.')
  return imageNameSegments[0]
}

export const REQUEST_TYPES = {
  GENERATE_IMAGE: 'generate image',
  SIMILAR_IMAGE: 'similar image',
  UPDATE_TAGS: 'update image tags',
}

export const ROUTES = {
  HOME: '/',
  GALLERY: '/gallery',
  LOGIN: '/login',
  LIKED: '/liked',
  SETTINGS: '/settings',
  SEARCH: '/search',
  GET_PLUS: '/get-plus',
  VIEW_TAGS: '/view-tags',
  VIEW: '/view',
  TOS: '/terms-of-service',
  PRIVACY: '/privacy-policy',
  COOKIES: '/cookie-policy',
  NOT_FOUND: '/not-found',
}

export interface User {
  name: string
  blacklist: string[]
  email: string
  uid: string
  is_plus: boolean
  liked_images: string[]
  votes: { [imageId: string]: number }
  theme?: string
}

export interface Image {
  ai_model: string
  created_at: Timestamp
  id: string
  request_id: string
  tags: string[]
  url: string
  votes: number
}
