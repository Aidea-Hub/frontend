import { Box } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'

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
import ViewSearchedIdeas from './pages/ViewSearchedIdeas'

export const App = () => (
  <>
    <SidebarWithHeader>
      <Box mt="90">
        <ScrollToTop>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.SEARCH} element={<Search />} />
            <Route path={ROUTES.GALLERY} element={<Gallery />} />
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
              path={`${ROUTES.VIEW_SEARCHED}`}
              element={<ViewSearchedIdeas />}
            />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
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
