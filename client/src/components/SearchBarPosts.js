import React from "react"


export default function SearchBarPosts(props) {
    const {handlePostSearch} = props

    return (

        <div className="searchbar-posts">

            <div>

              <input
                className="searchbar" 
                type="text" 
                placeholder="Type a Search Term..."
                onChange={(e)=>handlePostSearch(e)}
                />

            </div>

        </div>
    )}
