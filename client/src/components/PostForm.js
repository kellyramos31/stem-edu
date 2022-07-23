import React, { useState } from 'react'



const initInputs = {
  title: "",
  description: "",
  category: ""
}

export default function PostForm(props){


  const [inputs, setInputs] = useState(initInputs)
  const { addPost } = props

 

function handleChange(e){
    const {name, value} = e.target
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }))
  }

  function handleSubmitPost(e){
    e.preventDefault()
    addPost(inputs)
    console.log("inputs from addPost", inputs)
    setInputs(initInputs)
  }

  const { title, description } = inputs
  

  return (

    <div className="add-form-container">

      <form className="add-post-form" onSubmit={handleSubmitPost}>

          <h3 className="add-post-header">Add A New Post to the STEM Forum:</h3>

            <div className="category-radio-buttons" >
                Category: 
                  <input 
                    type="radio" 
                    id="Science"
                    index={props.index}
                    name="category"
                    checked={inputs.category === "Science"}  
                    value="Science"
                    onChange={handleChange}
                  /> Science
                  <input 
                    type="radio" 
                    id="Tech"
                    index={props.index}
                    name="category"
                    checked={inputs.category === "Tech"} 
                    value="Tech"
                    onChange={handleChange}
                  /> Tech
                  <input 
                    type="radio" 
                    id="Engineering"
                    index={props.index}
                    name="category" 
                    value="Engineering"
                    onChange={handleChange}
                  /> Engineering
                  <input 
                    type="radio" 
                    id="Math"
                    index={props.index}
                    name="category" 
                    checked={inputs.category === "Math"}
                    value="Math"
                    onChange={handleChange}
                  /> Math
            </div>

                  <input 
                    type="text" 
                    name="title" 
                    value={title} 
                    onChange={handleChange} 
                    placeholder="Title"
                  />
                  <input 
                    type="text" 
                    name="description" 
                    value={description} 
                    onChange={handleChange} 
                    placeholder="Description"
                  />

            <button className="add-post-btn">Add Post</button>

      </form>

    </div>

  )

}