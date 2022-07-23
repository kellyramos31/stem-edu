import React, { useState, useContext } from 'react'
import AddCommentForm from "./AddCommentForm.js"
import CommentsOnPost from "./CommentsOnPost.js"
import { PostCommentContext } from "../context/PostCommentProvider.js"
import { FaComments } from 'react-icons/fa'
import { MdOutlineComment} from 'react-icons/md'
import { AiFillEye} from 'react-icons/ai'
import { BiHide } from 'react-icons/bi'



export default function ForumPostText(props){


const {
    getCommentsSpecifiedPost

     } = useContext(PostCommentContext)



const [toggleIsCommenting, setToggleIsCommenting] = useState(false)

const [toggleIsViewingComments, setToggleIsViewingComments] = useState(false)


function toggleViewComments(postId){
    console.log("view comments toggled")
    console.log("postId from toggleViewComments", postId)
    setToggleIsViewingComments(prev => !prev)
    getCommentsSpecifiedPost(postId)
  }

function toggleToComment(){
   console.log("toggleToComment clicked")
    setToggleIsCommenting(prev => !prev)
  }


return (
  <div className="all-post-container" key={props._id}>

      <div className="all-posts" key={props._id}>

            <div className="forum-post-header">

                    <h1 className="post-icon">   
                            {props.category==="Science" ? "🔬"
                            :
                            props.category==="Tech" ? "💻"
                            :
                            props.category==="Engineering" ? "⚙️"
                            : 
                            "➗"
                        }
                    </h1>

                <h3><span className="posted-by">by</span>{" "}<span className="user-name-span-post">{props._user.username}</span></h3>  
                <h4 className="number-comments"><FaComments size={25} style={{ fill: "white"}}/> <span className="tallies-top">{props.numberCommentsOnPost}</span> </h4>
            
            </div>
               
            <h1 className="post-title"><span className="title-post">Title</span>{" "}{props.title}</h1>
            <h3 className="post-description"><span className="descr-post">Description</span>{" "}{props.description}</h3>

     
            <div className="comment-related-btns">
                  
              { !toggleIsCommenting 
        
              ?

              <div id={props._id}>
                <button className="leave-comment-btn" onClick={toggleToComment}><MdOutlineComment size={20} style={{ fill: "royalblue"}}/></button>
              </div>

              :

              <div id={props._id} className="comment-form" >

                  <AddCommentForm
                    _post={props._id}
                    toggleToComment={toggleToComment}
                  />
              
              </div>
              }

            </div>
            
    
              { !toggleIsViewingComments 
            
              ?

              <button className="see-comments-btn" key={props._id} onClick={()=>toggleViewComments(props._id)}> <div className="eye-btn-pieces"><AiFillEye
                size={20} style={{ fill: "royalblue"}}/></div></button>

              :
              
              <div>

                <button  className="hide-comments-btn" onClick={toggleViewComments}><BiHide size={20} style={{ fill: "royalblue"}}/></button>    
                      
                        <CommentsOnPost
                            _comments={props._comments}
                        />
               
              </div>
              }

      </div>
  </div>
)
}