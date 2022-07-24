
import React from "react"
import PostText from './PostText.js'


export default function PostList(props){

const { userPosts}  = props


return (

    <div className="user-post-list">
       {userPosts.map(userPost=> <PostText {...userPost} key={userPost._id}/>)}
    </div>
  )
}