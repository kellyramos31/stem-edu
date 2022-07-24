import React, {useState} from "react"
import QuestionChoice from "./QuestionChoice.js"



export default function Question(props){

const { question } = props

const [flip, setFlip]=useState(false)


return(
    <div className={`questionCard ${flip ? "questionFlip" : ""}`} onClick={()=>setFlip(!flip)}>

        {!flip 
        
        ?

            <div className="question-card-front">
                {question.categorySTEM==="Science" ? "🔬"
                :
                question.categorySTEM==="Tech" ? "💻"
                :
                question.categorySTEM==="Engineering" ? "⚙️"
                : 
                "➗"
                }
    
            </div>

        :
            <div className="question-card-back">

                <h4>{question.value}{" "}points</h4>

                <h2 className="question-category">      
           
                    {question.categorySTEM==="Science" ? "🔬"
                    :
                    question.categorySTEM==="Tech" ? "💻"
                    :
                    question.categorySTEM==="Engineering" ? "⚙️"
                    : 
                    "➗"
                    }
                   
                </h2>

                
                <h3>{question.answer}</h3>

                <div className="question-options" index={question.index}>

                        {question.questionOptions.map(questionOption=>
                            <QuestionChoice key={questionOption._id} question={question} questionOption={questionOption}/>
                    )}
                        
                </div>

                       
            </div>

        }

        </div>

)
}
