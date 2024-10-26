import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Home from '../components/Home'
import EmployeeHome from '../pages/employeepages/EmployeeHome'
import AdminHome from '../pages/adminpages/AdminHome'
import JudgeHome from '../pages/judgepages/JudgeHome'
import EmployeeRegister from '../pages/employeepages/EmployeeRegister'
import LandingPage from '../pages/LandingPage'
const Routers = () => {
  return (
    <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/home' element={<EmployeeHome/>}/>
        <Route path='/employeeRegister' element={<EmployeeRegister/>}/>
        <Route path='/judgedashboard' element={<JudgeHome/>}/>
        <Route path='/admindashboard' element={<AdminHome/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        
    </Routes>
  )
}
export default Routers