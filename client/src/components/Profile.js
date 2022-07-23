import React, { useContext, useEffect } from "react"
import PostForm from "./PostForm.js"
import PostList from "./PostList.js"
import MyScores from "./MyScores.js"
import MyBadges from "./MyBadges.js"
import { UserContext } from "../context/UserProvider.js"
import { PostCommentContext } from "../context/PostCommentProvider.js"
import { LearnGameContext } from "../context/LearnGameProvider.js"


export default function Profile() {

    const {
    user: {
        username
    }
    } = useContext(UserContext)

    const {
        postState,
        userPosts,
        getPosts,
        getUserPosts,
        addPost
    } = useContext(PostCommentContext)

   const {
        getMyGameScores,
        myScores,
        getBadgeCount,
        badgesAwarded
      } = useContext(LearnGameContext)




//USEEFFECT

  useEffect(() => {
    console.log("useEffect triggered")
    getUserPosts()
    getPosts()
    getMyGameScores()
    getBadgeCount()
    // eslint-disable-next-line  
  }, [postState])  



return (

    <div className="profile">

            <div>

                <h1 className="welcome-msg">Hi @{username}!</h1>

               

            </div>
    
               
            <div className="status-boxes-and-post-form">

                  <MyScores
                      myScores={myScores}
                  />

                  <MyBadges
                      badgesAwarded={badgesAwarded}
                  />
                
            </div>


            <PostForm
                addPost={addPost}
            />
           

            <h2 className="profile-posts-list-header">My STEM Forum Posts</h2>

            <div className="profile-posts-list">

                    <PostList
                        userPosts={userPosts}
                     />
               
            </div>
            
    </div>

        )
    }