import React, { useContext } from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import NavBar from "./components/NavBar.js"
import Auth from "./components/Auth.js"
import Profile from "./components/Profile.js"
import Forum from "./components/Forum.js"
import Learn from "./components/Learn.js"
import Game from "./components/Game.js"
import AdminDashboard from "./components/AdminDashboard.js"
import ProtectedRoute from "./components/ProtectedRoute.js"
import { UserContext } from "./context/UserProvider.js"


export default function App() {

const { user: {isAdmin}, token, logout} = useContext(UserContext)


  console.log("token from App.js", token)


  return (
    <div className="app">

      { token && <NavBar logout={logout} /> }

      <Routes>

        {/* NOTE:  need to somehow adjust so admin starts on /admin page instead of /profile page */}

        <Route exact path="/" element={token ? <Navigate to="/profile"/> : <Auth/> }/>  
     
       
        <Route element={<ProtectedRoute token={token}/>}>
              <Route
                path="/profile"
                element={<Profile/>}
                navigateTo="/"
              />

              <Route
                path="/forum"
                element={<Forum/>}
                navigateTo="/"
              />

                <Route
                path="/learn"
                element={<Learn/>}
                navigateTo="/"
              />

                <Route
                path="/play"
                element={<Game/>}
                navigateTo="/"
              />

               <Route
                path="/admin"
                element={<AdminDashboard/>}
                navigateTo="/"
                isAllowed={isAdmin}     
                /> 

              
          </Route>   
        

      </Routes>

    </div>
  )
}
