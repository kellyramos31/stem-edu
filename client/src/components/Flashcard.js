import React, {useState} from "react"


export default function Flashcard(props){

const { flashcard } = props

const [flipcard, setFlipcard] = useState(false)

return(
    //beginning of line below allows for dynamic classes
    <div className={`card ${flipcard ? "flip" : ""}`} onClick={()=>setFlipcard(!flipcard)}>

            {!flipcard

            ?

            <div className="card-front">
                <img src={flashcard.imageURL} width="200rem" height="250rem" alt="cardFront"/>
            </div>
        
            :

            <div className="card-back" key={flashcard._id}>

                    <h4 className="flashcard-category">
                            {flashcard.categorySTEM ==="Science" ? "🔬"
                            :
                            flashcard.categorySTEM==="Tech" ? "💻"
                            :
                            flashcard.categorySTEM==="Engineering" ? "⚙️"
                            : 
                            "➗"
                            }  
                    </h4>


                    <h2 className="name-flashcard">{flashcard.title}{" "}{flashcard.firstName}{" "}{flashcard.lastName}</h2>
                    <div className="profession">{flashcard.profession1}</div>
                    <div className="profession">{flashcard.profession2}</div>
                    <div className="profession">{flashcard.profession3}</div>
                    <h3 className="noteworthy-flashcard"><span>Noteworthy</span></h3> 
                    <h3>{flashcard.knownFor}</h3>
                    <h3><span>Born</span>&nbsp;&nbsp;{flashcard.born}</h3>
                    <h3><span>Details</span></h3>
                    <h3>{flashcard.fact1}</h3>
                    <h3>{flashcard.fact2}</h3>
                    <h3>{flashcard.fact3}</h3>
                    <h3>{flashcard.fact4}</h3>
                    <h3>{flashcard.fact5}</h3>
                    <h3><span>In {flashcard.firstName}'s words:</span></h3>
                    <h3 className="quote">{flashcard.quote1}</h3>
                    <h3 className="quote">{flashcard.quote2}</h3>
                    <h3 className="quote">{flashcard.quote3}</h3>
                    <h6 className="attribution">{flashcard.imageAttribution}</h6> 

            </div>
            
            }

    </div>

)}