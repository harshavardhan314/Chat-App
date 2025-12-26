import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
const App = () => {
  return (
    <div className="bg-[url('/src/assets/bgImage.svg')] bg-contain">

    <Routes>
      <Route path='/' element={<HomePage></HomePage>}/>
      <Route path='/Login' element={<LoginPage></LoginPage>}/>
      <Route path='/Profile' element={<ProfilePage></ProfilePage>}/>
    </Routes>
      
    </div>
  )
}

export default App
