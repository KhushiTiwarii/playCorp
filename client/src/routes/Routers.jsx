import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Home from '../components/Home'
const Routers = () => {
  return (
    <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        
    </Routes>
  )
}
export default Routers