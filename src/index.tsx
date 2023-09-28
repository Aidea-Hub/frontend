import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import reportWebVitals from './reportWebVitals'
import * as serviceWorker from './serviceWorker'
// import { GoogleOAuthProvider } from '@react-oauth/google'

import { App } from './App'
import myTheme from './config/theme'

const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')
const root = ReactDOM.createRoot(container)
const queryClient = new QueryClient()

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  console.log = () => {}
}

root.render(
  // <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
    <HelmetProvider>
      <ColorModeScript initialColorMode={myTheme.config.initialColorMode} />
      <ChakraProvider theme={myTheme}>
        <BrowserRouter>
          <RecoilRoot>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </RecoilRoot>
        </BrowserRouter>
      </ChakraProvider>
    </HelmetProvider>
  // </GoogleOAuthProvider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
