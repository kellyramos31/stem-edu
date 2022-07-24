import React, { useContext, useEffect} from "react"
import ForumPostList from "./ForumPostList.js"
import DropMenuPosts from "./DropMenuPosts.js"
import SearchBarPosts from "./SearchBarPosts.js"
import { PostCommentContext } from "../context/PostCommentProvider.js"




export default function Forum() {


      const {
        postState,
        posts,
        userPosts,
        getUserPosts,
        getPosts,
        getComments,
        handleMenuPosts,
        handlePostSearch
    } = useContext(PostCommentContext)



  //USEEFFECT
  useEffect(() => {
    console.log("useEffect triggered")
    getUserPosts()
    getPosts()
    getComments()
    // eslint-disable
    // eslint-disable-next-line  
  }, [postState])



    return (
      <div className="forum">

          <h3 className="title-forum-page">Let's Talk About STEM!</h3>
            
            <div className="dropdown-posts">

                <DropMenuPosts
                  handleMenuPosts={handleMenuPosts}
                  getPosts={getPosts}
                />

            </div>

            <div>

                <SearchBarPosts
                  handlePostSearch={handlePostSearch}
                />

            </div>

          
                <ForumPostList 
                  posts={posts}
                  userPosts={userPosts}
                />

      </div>
    )
}
