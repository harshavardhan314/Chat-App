import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { AuthContext } from './context/AuthContext.jsx'

import {Toaster} from 'react-hot-toast';
const App = () => {

  const {authUser}=useContext(AuthContext);



  return (
    <div className="bg-[url('/src/assets/bgImage.svg')] bg-contain">
      <Toaster></Toaster>

    <Routes>
      <Route path='/' element={authUser ? <HomePage></HomePage> : <Navigate to="/Login"/>}/>
      <Route path='/Login' element={authUser ? <Navigate to="/"/> : <LoginPage></LoginPage>}/>
      <Route path='/Profile' element={authUser ? <ProfilePage></ProfilePage> : <Navigate to="/Login"/>}/>
    </Routes>
      
    </div>
  )
}

export default App
