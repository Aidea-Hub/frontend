import axios from 'axios'

const baseURL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_CLOUD_FUNCTION_PROD_URL
    : process.env.REACT_APP_CLOUD_FUNCTION_DEV_URL

export const authApi = axios.create({
  baseURL: baseURL,
})

export default authApi
