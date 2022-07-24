import React, {useContext} from "react"
import { LearnGameContext } from "../context/LearnGameProvider.js"
// import Modal from "./Modal.js"


export default function QuestionChoice(props){

const { question, questionOption } = props

const {
    handleGameAnswerClick
    } = useContext(LearnGameContext)

// const [openModal, setOpenModal] = useState(false)

return(
    <div>
     
        <div className="indiv-option" >
       
            <div key="question.questionOption._id" onClick={()=>handleGameAnswerClick(question._user, question, questionOption)}>
            
                <h2>{questionOption.questionText}</h2>

            </div>

                
 
        </div>

        {/* <div>
        <button onClick={()=>setOpenModal(!openModal)}>Toggle Modal</button>


                {!openModal
                ?
                null
                :
                
                <Modal/>
                } 

    </div> */}
    </div>
          
)}


