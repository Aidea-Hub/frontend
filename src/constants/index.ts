import { Timestamp } from 'firebase/firestore'

export const getCDNUrl = (ideaId: string) => {
  return 'https://picsum.photos/seed/' + ideaId + '/400/600'
}

export interface Request {
  uid: string
  status?: string
  url?: string
  tags?: string[]
}
export const getIdeaIdFromUrl = (url: string): string => {
  const pathSegments = url.split('/')
  const ideaNameWithExtension = pathSegments[pathSegments.length - 1]
  // Split the idea name by '.' to get an array of name and extension
  const ideaNameSegments = ideaNameWithExtension.split('.')
  return ideaNameSegments[0]
}

export const REQUEST_TYPES = {
  GENERATE_IMAGE: 'generate idea',
  SIMILAR_IMAGE: 'similar idea',
  UPDATE_TAGS: 'update idea tags',
}

export const ROUTES = {
  HOME: '/',
  GALLERY: '/gallery',
  LOGIN: '/login',
  LIKED: '/liked',
  PAST_IDEAS: '/past-ideas',
  SETTINGS: '/settings',
  SEARCH: '/search',
  GET_PLUS: '/get-plus',
  VIEW_SEARCHED: '/view-searched',
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
  liked_ideas: string[]
  votes: { [ideaId: string]: number }
  theme?: string
}

export interface Idea {
  ai_model: string
  created_at: Timestamp
  id: string
  request_id: string
  tags: string[]
  url: string
  votes: number
}
