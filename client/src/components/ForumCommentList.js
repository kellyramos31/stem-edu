import React, {useContext}  from "react"
import ForumCommentText from "./ForumCommentText.js"
import { PostCommentContext } from "../context/PostCommentProvider.js"

export default function ForumCommentList(){

      const {
        postComments
    } = useContext(PostCommentContext)


return (

    <div>
      {postComments.map(comment => <ForumCommentText {...comment} key={comment._id}/>)}
    </div>

)}