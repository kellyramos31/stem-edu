import React, {useState, useContext} from "react"
import { FaEdit } from 'react-icons/fa'
import { RiDeleteBin6Fill} from 'react-icons/ri'
import EditCommentForm from "./EditCommentForm.js"
import { UserContext} from "../context/UserProvider.js"
import { PostCommentContext } from "../context/PostCommentProvider.js"



export default function CommentsOnPost(props){

    const {
        _comments
    } = props
 
    const {
    user: {
        username,
        isAdmin
    },
        
    } = useContext(UserContext)

    const {
    deleteComment
     } = useContext(PostCommentContext)


    const [isEditing, setIsEditing] = useState("")   
 



function toggleToEdit(index, id, _post){
    console.log("toggleToEdit index", index)
    console.log("toggleToEdit postComment._id", id)
    console.log("toggleToEdit clicked!")
    setIsEditing(id)
    console.log("isEditing", isEditing)
  }

 
    
return(

        <div>
            <h3 className="public-comments">Comments
                {_comments.map((_comment, index)=> 
                                             
                <li key={_comment._id} id={_comment._id} index={index} className="comment-list-item">
                <span className="user-name-span-comment">{_comment._user.username}</span> {" "}{_comment.commentText}
               
         

            {username === _comment._user.username || isAdmin  
            
            ? 

            <div key={index} id={_comment._id} className="edit-del-comment-btns">

                    <div className="edit-del-btns-group">
                        <button className="delete-comment-btn" onClick={() => deleteComment(_comment._id, _comment._post)}><RiDeleteBin6Fill size={15} style={{ fill: "royalblue"}}/></button>
                        <button className="edit-comment-btn" onClick={()=>toggleToEdit(index, _comment._id, _comment._post)}><FaEdit size={15} style={{ fill: "royalblue"}}/></button> 
                    </div>

            </div>

            :

            <div key={index} id={_comment._id}>
                {null}    
            </div>

            }             
                        
                         
            {isEditing ===_comment._id

            ?
              
            <div key={index} id={_comment._id}>

                  <EditCommentForm
                    key={_comment._id}
                    id={_comment._id}
                    _comment={_comment}
                    toggleToEdit={toggleToEdit}
                />
         
            </div>

            :

            <div>
                {null}
            </div>

            }          

            </li>

            )}

            </h3>
        </div>

)}


