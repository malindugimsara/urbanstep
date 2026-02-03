import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage'
import AdminPage from './pages/adminPage'
import { Toaster } from 'react-hot-toast'
import TestPage from './test'
import RegisterPage from './pages/register'
import HomePage from './pages/homePage'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ForgotPasswordPage from './pages/forgotPassword'

function App() {
  
  return (
    <GoogleOAuthProvider clientId='618154866633-8mkqpu1e137jbj8ims5rm7k50cdevsus.apps.googleusercontent.com'>
    <BrowserRouter>
    <Toaster position="top-center" /> 
      <Routes path="/*">
        <Route path="/*" element= {<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
      </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
