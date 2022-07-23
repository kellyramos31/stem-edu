import React, { useState } from "react"
import axios from "axios"


export const PostCommentContext = React.createContext({})

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

export default function PostCommentProvider(props) {

        const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || "",
        userPosts: [],
        posts: [],
        comments: [],
        errMsg: ""
    }

const [postState, setPostState] = useState(initState)

const [postComments, setPostComments] = useState([])

const [searchTerm, setSearchTerm] = useState("")


function getPosts(){
        userAxios.get("/api/forumpost")
        .then(res => {
            console.log("res from postCommentProvider:", res)
            setPostState(prevState => ({
                ...prevState,
                posts: res.data
            }))

             console.log("posts from getPosts", res.data)
        })
        .catch(err => console.log(err.response.data.errMsg))
    }


 //GET USER'S INDIVIDUAL ISSUES   

function getUserPosts(){
  userAxios.get("/api/forumpost/user")
    .then(res => {
      console.log(res)
      setPostState(prevState => ({
        ...prevState,
        userPosts: res.data
      }))
      console.log("userPosts from getUserPosts", res.data)
    })
    .catch(err => console.log(err.response.data.errMsg))
  }


//GET ALL COMMENTS (regardless of user)
function getComments(){
        userAxios.get("/api/comment")
        .then(res => {
            console.log(res)
            setPostState(prevState => ({
                ...prevState,
                comments: res.data
            }))
            console.log("comments from getComments", res.data)
        })
        .catch(err => console.log(err.response.data.errMsg))

}


//ALL COMMENTS FOR SPECIFIED POST
function getCommentsSpecifiedPost(postId){

console.log("_post from getCommentsSpecifiedPost", postId)

    userAxios.get(`api/comment/post/${postId}`)
        .then(res => {
            console.log("res from getCommentsSpecifiedPost", res)
            setPostComments(res.data)
            console.log("postComments", postComments)
        })

        .catch(err => console.log(err.response.data.errMsg))
    }
    

//ADD POST
    function addPost(newUserPost) {
        userAxios.post("/api/forumpost", newUserPost)
          .then(res => {
            console.log(res)
            setPostState(prevState => ({
                ...prevState,
                postState:  [...prevState.userPosts, res.data]
            }))
        })
        .catch(err=>console.log(err.response.data.errMsg))
    }


//DELETE POST
function deletePost(postId) {
        console.log("postId:", postId)

        userAxios.delete(`/api/forumpost/${postId}`)
             .then(res => {
                setPostState(prevState=> ({userPosts: prevState.userPosts.filter(userPost => userPost._id !== postId)}))
                getPosts()
             })
        
            .catch(err=>console.log(err.response.data.errMsg))
    }


//DELETE ALL ASSOCIATED COMMENTS WHEN DELETE A POST

// function deleteAllPostComments(postId){
//     console.log("delete all post comments hit")
//         userAxios.delete(`api/comment/post${postId}`)
//              .then(res => {
//                 setPostState(prevState=> ({postComments: prevState.postComments.filter(postComment => postComment._id !== postId)}))
//                 getPosts()
//              })
        
//             .catch(err=>console.log(err.response.data.errMsg))

// }


//EDIT USER'S ISSUE
    function editPost(inputs, postId) {
        console.log("postId to be edited", postId)
        console.log("inputs for edit", inputs)
        userAxios.put(`/api/forumpost/${postId}`, inputs)
         .then(res => {
            setPostState(prevState => prevState.userPosts.map(userPost => userPost._id !== postId ? userPost : res.data))
      })
      .catch(err=>console.log(err.response.data.errMsg))
    }

 
//COMBINED ADD COMMENT
function combinedAddComment (commentText, _post){
  addComment(commentText, _post)
  addCommentTally(_post)
}

//ADD COMMENT
   function addComment(commentText, _post) {
      const commentAdd = {
        commentText: commentText,
        _post: _post
      }
      // const _issue = issueId
      console.log("commentAdd:", commentAdd)
      // console.log("adding comment -- issueId:", issueId)
      userAxios.post("/api/comment", commentAdd)
         
        .then(res => {
            console.log("addComment res", res)
            setPostState(prevState => ({
                ...prevState,
                postState:  [...prevState.posts, res.data]
            })
              )})
        .catch(err=>console.log(err.response.data.errMsg))
    }


//INCREMENT COMMENT TOTAL ON SPECIFIC ISSUE
function addCommentTally (postId) {
    console.log("_post from addCommentTally:", postId)
    userAxios.put(`/api/forumpost/increment/${postId}`, postId)
    .then(res => {
            console.log("addComment res", res)
            setPostState(prevState => ({
                ...prevState,
                postState:  [...prevState.posts, res.data]
            })
              )})
            
        .catch(err=>console.log(err.response.data.errMsg))
        
} 



//DELETE USER'S COMMENT (this deletes the comment record, decrements the comment tally & deletes the _comments ref in the post record)
    function deleteComment(commentId, postId) {
        console.log("commentId:", commentId)
        userAxios.delete(`/api/comment/${commentId}`)
             .then(res => {
                setPostState(prevState=> ({posts: prevState.posts.filter(post=> post._comment !== commentId)}))
                deleteCommentFromPostArray(commentId, postId)
                minusCommentTally(postId)
             })
        
            .catch(err=>console.log(err.response.data.errMsg))
    }

 //DELETE COMMENT FROM ARRAY of comments ids (_comments) in the issue -- route works in Postman by itself
 function deleteCommentFromPostArray(commentId, postId) {

     const _post = {
       _post: postId
   }

    console.log("comment._id to delete:", commentId)
    console.log("post to update the comments array in:", postId)
    userAxios.put(`/api/comment/deleteCommentFromPost/${commentId}`, _post)
            // console.log("commentId:", commentId)
         .then(res => {
            console.log("getting rid of _comments id in post collection")
            // setPostState(prevState => prevState.posts.map(post => post._id !== postId ? post : res.data))
      })
            
    .catch(err=>console.log(err.response.data.errMsg))
}


//DECREMENT COMMENT TOTAL ON SPECIFIC ISSUE
function minusCommentTally (postId) {
    console.log("_post from minusCommentTally:", postId)
    userAxios.put(`/api/forumpost/decrement/${postId}`, postId)
    .then(res => {
            console.log("minusComment res", res)
            setPostState(prevState => ({
                ...prevState,
                postState:  [...prevState.posts, res.data]
            })
           
              )})
            
        .catch(err=>console.log(err.response.data.errMsg))
        
} 


//EDIT COMMENT
   function editComment(inputs, commentId){
        console.log("commentId to be edited", commentId)
        console.log("inputs for edit", inputs)
        userAxios.put(`/api/comment/${commentId}`, inputs)
         .then(res => {
            
            setPostState(prevState => prevState.posts.map(post => post._comment !== commentId ? post.userComment : res.data))
      })
      .catch(err=>console.log(err.response.data.errMsg))
    }

//STEM CATEGORY DROPDOWN MENU FOR POSTS -- FILTER
function handleMenuPosts(e){
        console.log(e.target.value)
        userAxios.get(`/api/forumpost/search/category?category=${e.target.value}`)
            .then(res => {
                setPostState({posts: res.data})
                console.log("dropdown filtered data", res.data)
                console.log("postState", postState)
        })
              .catch(err=>console.log(err.response.data.errMsg))  
    }


//SEARCHBAR TERMS IN POSTS
function handlePostSearch(e) {
    console.log("e.target.value", e.target.value)
    setSearchTerm({searchTerm: e.target.value})
    console.log("searchTerm", searchTerm)
    userAxios.get(`/api/forumpost/search/userterm?searchTerm=${e.target.value}`)
             .then(res => {
                setPostState({posts: res.data})
                console.log("searchbar filtered data", res.data)
                console.log("postState", postState)
        })
              .catch(err=>console.log(err.response.data.errMsg))  
    }



    return (
        <PostCommentContext.Provider
            value={{
            ...postState,
            getUserPosts,
            getPosts,
            handleMenuPosts,
            addPost,
            deletePost,
            editPost,
            getComments,
            getCommentsSpecifiedPost,
            postComments,
            addComment,
            combinedAddComment,
            deleteComment,
            deleteComment,
            editComment,
            handlePostSearch
           
        }}>

        {props.children}


        </PostCommentContext.Provider>

    )

}
