import { Box, useColorMode } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'

import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRecoilState } from 'recoil'
import Footer from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import SidebarWithHeader from './components/SidebarWithHeader'
import { ROUTES } from './constants'
import Gallery from './pages/Gallery'
import GetPlus from './pages/GetPlus'
import Home from './pages/Home'
import CookiesPolicy from './pages/Legal/CookiesPolicy'
import PrivacyPolicy from './pages/Legal/PrivacyPolicy'
import TermsOfService from './pages/Legal/TermsOfService'
import Liked from './pages/Liked'
import Login from './pages/Login'
import PageNotFound from './pages/PageNotFound'
import PastIdeas from './pages/PastIdeas'
import Search from './pages/Search'
import Settings from './pages/Settings'
import ViewIdea from './pages/ViewIdea'
import IdeaGeneration from './pages/IdeaGeneration'
import FullIdea from './pages/FullIdea/FullIdea'
import { colorModeState } from './recoil/atoms'
export const App = () => {
  const { colorMode } = useColorMode()
  const [recoilColorMode, setRecoilColorMode] = useRecoilState(colorModeState)

  useEffect(() => {
    setRecoilColorMode(colorMode)
  }, [colorMode, setRecoilColorMode])

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <SidebarWithHeader>
        <Box mt="90">
          <ScrollToTop>
            <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.SEARCH} element={<Search />} />
              <Route path={ROUTES.GALLERY} element={<Gallery />} />
              <Route 
              path={ROUTES.IDEA_GENERATION} 
              element={
                <ProtectedRoute>
                  <IdeaGeneration />
                </ProtectedRoute>
              } />
              <Route
              path={ROUTES.FULL_IDEA} 
              element={
                <ProtectedRoute>
                  <FullIdea />
                </ProtectedRoute>
              } />
              <Route
                path={ROUTES.LIKED}
                element={
                  <ProtectedRoute>
                    <Liked />
                  </ProtectedRoute>
                }
              />
              <Route path={ROUTES.GALLERY} element={<Gallery />} />
              <Route
                path={ROUTES.PAST_IDEAS}
                element={
                  <ProtectedRoute>
                    <PastIdeas />
                  </ProtectedRoute>
                }
              />
              <Route path={`${ROUTES.VIEW}/:ideaId`} element={<ViewIdea />} />
              <Route
                path={ROUTES.SETTINGS}
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.GET_PLUS} element={<GetPlus />} />
              <Route path={ROUTES.TOS} element={<TermsOfService />} />
              <Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
              <Route path={ROUTES.COOKIES} element={<CookiesPolicy />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </ScrollToTop>
        </Box>
        <Footer />
      </SidebarWithHeader>
    </>
  )
}
