import { Navigate, Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'

import SignUpPage from './pages/AuthPages/SignUpPage'
import LoginPage from './pages/AuthPages/LoginPage'
import VerifyEmailPage from './pages/AuthPages/VerifyEmailPage'
import ForgotPasswordPage from './pages/AuthPages/ForgotPasswordPage'
import ResetPasswordPage from './pages/AuthPages/ResetPasswordPage'

import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPages/MenuPage'
import MenuItemPage from './pages/MenuPages/MenuItemPage'
import CheckoutPage from './pages/MenuPages/CheckoutPage'
import MyOrdersPage from './pages/MenuPages/MyOrdersPage'

import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (user && !user.isVerified) {
    return <Navigate to='/verify-email' replace />
  }

  return children
}

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to='/' replace />
  }

  return children
}

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Routes>
        <Route path='/' element={ <HomePage />} />

        <Route path='/menu/:categoryName' element={<MenuPage />} />
        <Route path='/menu/item/:itemName' element={<MenuItemPage />} />
        <Route path='/checkout' element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>} 
        />
        <Route path='/myorders' element={
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>} 
        />

        <Route path='/signup' element={ 
          <RedirectAuthenticatedUser>
            <SignUpPage />
          </RedirectAuthenticatedUser>} 
        />
        <Route path='/login' element={ 
          <RedirectAuthenticatedUser>
            <LoginPage />
          </RedirectAuthenticatedUser>} 
        />
        <Route path='/verify-email' element={ 
          <RedirectAuthenticatedUser>
            <VerifyEmailPage />
          </RedirectAuthenticatedUser>} 
        />
        <Route path='/forgot-password' element={ 
          <RedirectAuthenticatedUser>
            <ForgotPasswordPage />
          </RedirectAuthenticatedUser>} 
        />
        <Route path='/reset-password/:token' element={ 
          <RedirectAuthenticatedUser>
            <ResetPasswordPage />
          </RedirectAuthenticatedUser>} 
        />
      </Routes>
    </>
  )
}

export default App
