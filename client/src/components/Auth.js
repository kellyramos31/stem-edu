import React, { useState, useContext } from 'react'
import AuthForm from './AuthForm.js'
import { UserContext } from "../context/UserProvider.js"

const initInputs = { username: "", password: ""}

export default function Auth(){
  const [inputs, setInputs] = useState(initInputs)
  const [toggle, setToggle] = useState(false)

  const {signup, login, errMsg, resetAuthErr } = useContext(UserContext)


  function handleChange(e){
    const {name, value} = e.target
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }))
  }

  function handleSignup(e){
    e.preventDefault()
    signup(inputs)
  }

  function handleLogin(e){
    e.preventDefault()
    login(inputs)
  }

  function toggleForm(){
    setToggle(prev => !prev)
    resetAuthErr()
  }

  return (
    <div className="auth-container">
      <img className="owl" src="./images/416387_bird_eyes_night_owl_vision_icon.png" alt="owl"/>
      <h1 className="app-title">WiSE</h1>
      <h5 className="app-sub-title">Women in STEM Education</h5>
      { !toggle ?
        <>
          <AuthForm 
            handleChange={handleChange}
            handleSubmit={handleSignup}
            inputs={inputs}
            btnText="Sign up"
            errMsg={errMsg}
          />
          <p onClick={toggleForm} className="member-or-not">Already a member?</p>
        </>
      :
        <>
          <AuthForm 
            handleChange={handleChange}
            handleSubmit={handleLogin}
            inputs={inputs}
            btnText="Login"
            errMsg={errMsg}
          />
          <p onClick={toggleForm} className="member-or-not">Not a member?</p>
        </>
      }
    </div>
  )
}
