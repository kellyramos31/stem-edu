import React, { useState } from "react"
import axios from "axios"



export const UserContext = React.createContext({})


//this userAxios.interceptors code below  (lines 11-17) --> makes sure that the authorization header & token goes along with every request

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})


export default function UserProvider(props) {

    const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || "",
        flashcards: [],
        userPosts: [],
        userComments: [],
        errMsg: ""
    }


    const [userState, setUserState] = useState(initState)


   
//SIGNUP
    function signup(credentials) {
        axios.post("/auth/signup", credentials)
        .then(res => {
            const { user, token } = res.data
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
            setUserState(prevUserState => ({
                ...prevUserState,
                user,
                token
            }))
        })
        .catch(err => handleAuthErr(err.response.data.errMsg))
    }

   
//LOGIN
    function login(credentials) {
        axios.post("/auth/login", credentials)
        .then(res => {
            const { user, token} = res.data
            console.log("login user, token from UserProvider", res.data)
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
            //getUserIssues()
            console.log("getUserIssues from UserProvider")
            // getUserComments()
            setUserState(prevUserState => ({
                ...prevUserState,
                user,
                token
            }))
        })
        .catch((err) => handleAuthErr(err.response.data.errMsg))
    }

//LOGOUT
    function logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUserState({
            user: {},
            token: "",
            userPosts: [],
            userComments: []
            // comments: []
        })
    }

//HANDLE AUTH ERROR (this saves the errMsg in state so can display it on the Auth.js(Login Signup) Page)
    function handleAuthErr(errMsg){
        setUserState(prevState => ({
            ...prevState,
            errMsg
        }))
    }



//RESET AUTH ERROR
    function resetAuthErr(){
        setUserState(prevState =>({
            ...prevState,
            errMsg: ""
        }))
    }




return (

    <UserContext.Provider
        value={{
            ...userState,
            signup,
            login,
            logout,
            resetAuthErr
        }}>

        {props.children}

    </UserContext.Provider>

  )
}