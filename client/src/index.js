import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from "./App.js"
import UserProvider from "./context/UserProvider.js"
import LearnGameProvider from "./context/LearnGameProvider.js"
import PostCommentProvider from "./context/PostCommentProvider"
import "./css/styles.css"



const root = ReactDOM.createRoot(document.getElementById('root')); //React 18.0 change

root.render(
  <BrowserRouter>
      <PostCommentProvider>
          <LearnGameProvider>
              <UserProvider>
                  <App />
              </UserProvider>
          </LearnGameProvider>
      </PostCommentProvider>
  </BrowserRouter>,
  document.getElementById('root')
)


