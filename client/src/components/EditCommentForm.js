import React, {useState, useContext} from "react"
import { MdCancel } from 'react-icons/md'
import { PostCommentContext } from "../context/PostCommentProvider.js"


export default function EditCommentForm(props) {

const {id, _comment, toggleToEdit } = props


const [inputsCommentEdit, setInputsCommentEdit] = useState("")


const {
      editComment
     } = useContext(PostCommentContext)

function handleChangeEdit(e){
    const {name, value} = e.target
    setInputsCommentEdit(prevInputs => ({
      ...prevInputs,
      [name]: value
    }))
    }




return(
    <div>

        <div className="edit-comment-form-group">

            <form className="edit-comment-form" onSubmit={()=>editComment(inputsCommentEdit, id)}>

                    <input
                        type="text"
                        defaultValue={_comment.commentText}
                        inputs={_comment.commentText || inputsCommentEdit}
                        name="commentText"
                        onChange={handleChangeEdit}
                        placeholder="Comment Text"
                    />

                <div className="edit-comments-grp-btns">
                    <button className="submit-edited-comment-btn">Submit Edit</button>
                    <button  className="cancel-edit-comment-btn" onClick={()=>toggleToEdit(id, _comment._post)}><MdCancel
                    size={20} style={{ fill: "royalblue"}}/></button>
                </div>

            </form>

        </div>

     </div>
)}
      