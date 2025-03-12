import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home/Home.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout/Layout.tsx'
import Auth from './pages/Auth/Auth.tsx'
import Weather from './pages/Weather/Weather.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/home' element={<Home />} />
          <Route path='/weather' element={<Weather />} />
          <Route path='/login' element={<Auth />} />
          <Route path='/register' element={<Auth />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
