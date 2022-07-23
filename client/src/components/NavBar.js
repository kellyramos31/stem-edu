
import React, {useContext} from 'react'
import { UserContext } from "../context/UserProvider.js"
import { Link } from 'react-router-dom'

export default function NavBar(props){

    const {
    user: {
        isAdmin
    }
    } = useContext(UserContext)

  const { logout } = props
  
  return (

    <nav className="navbar">

        {!isAdmin && <Link to="/profile">Profile</Link>}
        <Link to="/forum">Forum</Link>
        <Link to="/learn">Learn</Link>
        <Link to="/play">Play</Link>
        {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
        <button className="logout-btn" onClick={logout}>Logout</button>

    </nav>
  )

}