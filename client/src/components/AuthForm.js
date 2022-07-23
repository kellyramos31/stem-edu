import React from 'react'

export default function AuthForm(props){
  const {
    handleChange, 
    handleSubmit, 
    btnText, 
    errMsg,
    inputs: {
      username, 
      password,
      adminCode
    } 
  } = props
  
  return (

    <form className="auth-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={username} 
        name="username" 
        onChange={handleChange} 
        placeholder="Username"
      />
      <input 
        type="text" 
        value={password} 
        name="password" 
        onChange={handleChange} 
        placeholder="Password"
      />
       <input 
        type="text" 
        value={adminCode} 
        name="adminCode" 
        onChange={handleChange} 
        placeholder="Admin Code"
      />
      <button className="sign-up-btn">{ btnText }</button>
      <p style={{color: "red"}}>{errMsg}</p>
    </form>

  )
}