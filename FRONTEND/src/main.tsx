import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout/Layout.tsx'
import Auth from './pages/Auth/Auth.tsx'
import Weather from './pages/Weather/Weather.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/home' element={<Weather />} />
          <Route path='/login' element={<Auth />} />
          <Route path='/register' element={<Auth />} />
          <Route path='*' element={<Weather />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
