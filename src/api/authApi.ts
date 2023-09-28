import axios from 'axios'
import { toast } from 'react-toastify'
import { getRecoil } from 'recoil-nexus'
import { colorModeState } from '../recoil/atoms'

const baseURL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_CLOUD_FUNCTION_PROD_URL
    : process.env.REACT_APP_CLOUD_FUNCTION_DEV_URL

const authApi = axios.create({
  baseURL: baseURL,
})

const getErrorMessage = (error: any) => {
  return `Error ${error.response.status}: Something went wrong.`
}

authApi.interceptors.response.use(
  response => {
    const colorMode = getRecoil(colorModeState)
    console.log(colorMode)
    // Display a success message for POST, PUT, or DELETE methods
    const method = response.config.method?.toUpperCase() || ''
    if (
      ['POST', 'PUT', 'DELETE'].includes(method) &&
      (response.status === 200 || response.status === 201)
    ) {
      toast.success('Operation successful', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: colorMode as 'light' | 'dark',
      })
    }
    return response
  },
  async error => {
    const colorMode = getRecoil(colorModeState)
    toast.error(getErrorMessage(error), {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: colorMode as 'light' | 'dark',
    })
    throw error
  }
)

export default authApi
