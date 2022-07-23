import React, { useState } from "react"
import axios from "axios"


export const LearnGameContext = React.createContext({})

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

export default function LearnGameProvider(props) {

        const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || "",
        flashcards: [],
        questions: [],
        errMsg: ""
    }

const [flashcardState, setFlashcardState] = useState(initState)

const [gameState, setGameState] = useState([])

const [questionsAnswered, setQuestionsAnswered] = useState(0)

const [questionsCorrect, setQuestionsCorrect] = useState(0)

const [badgeReward, setBadgeReward] = useState(0)

const [badgesAwarded, setBadgesAwarded] = useState(0)

const [gameScore, setGameScore] = useState(0)

const [isModalOpen, setIsModalOpen] = useState(false)

const [myScores, setMyScores] = useState([])

const [searchTerm, setSearchTerm] = useState("")

//GET ALL FLASHCARDS
function getFlashcards(){
        console.log("getFlashcards hit")
        userAxios.get("/api/learngame/learn")
        .then(res => {
             console.log("res from learnGameProvider:", res)
             setFlashcardState(prevState => ({
                ...prevState,
                flashcards: res.data
            }))
             console.log("flashcards from getFlashcards", res.data)
        })
        .catch(err => console.log(err.response.data.errMsg))
    }


//GET ALL GAME QUESTIONS
function getGameQuestions(){
        console.log("getGameQuestions hit")
        userAxios.get("/api/learngame/play")
        .then(res => {
            console.log("res from learnGameProvider:", res)
             setGameState(prevState => ({
                ...prevState,
                questions: res.data.sort(()=>Math.random() -.5) //note: would be better to use Fisher-Yates algorithm, but this does move them around
            }))
    
        })

        .catch(err => console.log(err.response.data.errMsg))
    }


//*****NOTE:  WHEN RESET GAME -- NEED TO UPDATE HISTORY IN USER PROFILE/MODEL*****
 //GAME RESET
 function gameReset(){
    getGameQuestions()
    setQuestionsAnswered(0)
    setQuestionsCorrect(0)
    setGameScore(0)
 }   

 //SHUFFLE QUESTIONS ARRAY
 //use Fisher-Yates Algorithm to shuffle the questions??
//Fisher-Yates Algorithm:

// var alphabet=["a","b","c","d","e"];
// function randomArrayShuffle(questions) {
//   var currentIndex = questions.length, temporaryValue, randomIndex;
//   while (0 !== currentIndex) {
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;
//     temporaryValue = questions[currentIndex];
//     questions[currentIndex] = questions[randomIndex];
//     questions[randomIndex] = temporaryValue;
//   }
//   return questions;
// }



//SAVE USER'S GAME SCORE
 function saveMyScore(gameScore) {

   const scoreTotal = {
       scoreTotal: gameScore
   }

   userAxios.post("/api/learngame/play/score", scoreTotal)
        .then(res => {
            console.log(res)
            console.log(res.data)
            setQuestionsAnswered(0)
            setQuestionsCorrect(0)
            setGameScore(0)
            })

        .catch(err=>console.log(err.response.data.errMsg))
    }


//GET ALL OF USER'S SCORES & SORT IN DESCENDING ORDER & ONLY KEEP TOP 3 GAME SCORES
function getMyGameScores() {
    userAxios.get("/api/learngame/play/score/user")
    .then(res => {
        console.log(res)
        setMyScores(res.data) 
    })
    .catch(err=>console.log(err.response.data.errMsg))
}

//Toggle Modal

// function areYouWorking(){
//     console.log("MODAL!!!!")
// }

//TOGGLE MODAL
function toggleModal(){
    setIsModalOpen(!isModalOpen)
}

//HANDLE ANSWER CHOICE SELECTION
function handleGameAnswerClick(_user, question, questionOption) {
    console.log("handling game answer click")
    console.log("gameScore", gameScore)
    console.log("questionOption.isCorrect", questionOption.isCorrect)
    console.log("question.value", question.value)
    console.log("question._id", question._id)
    console.log("questionOption._id", questionOption._id)
    setQuestionsAnswered(questionsAnswered + 1)
 

    if(questionOption.isCorrect === true) {
        setGameScore(gameScore + question.value)   
        setQuestionsCorrect(prev=> prev + 1)
        filterAnsweredQuestion(question._id)
        console.log("Stellar!  That's correct.")
    } else {
        //provide message feedback that answer is not correct -- & what else?
            console.log("Sorry, that's not correct.")
            filterAnsweredQuestion(question._id)
            }

    rewardCheck(questionsCorrect)
}

//CHECK FOR REWARD -- ***ALSO NEED TO SAVE SOMETHING TO SCORE SUMMARY SO BADGES SHOW UP IN PROFILE SUMMARY
 function rewardCheck(){
  console.log("questionsCorrect from rewardCheck", questionsCorrect)
  if((questionsCorrect !== 0) && ((questionsCorrect + 1) % 3 === 0)){
            console.log("GET A REWARD!!!")
            setBadgeReward(badgeReward + 1)
            console.log("badgeReward #", badgeReward)
            incrementUserBadgeCount()
        }
      
    }


function incrementUserBadgeCount(){
    console.log("hit incrementUserBadgeCount function")
    userAxios.put("/api/learngame/play/badge/increment")
     .then(res => {
            console.log("res from incrementUserBadgeCount", res)
            console.log(res.data)
            })
        .catch(err=>console.log(err.response.data.errMsg))
    }


// //GET USER'S BADGECOUNT
function getBadgeCount(){
    userAxios.get(`/api/learngame/play/badge/count`)
        .then(res => {
        console.log(res)
        setBadgesAwarded(res.data) 
    })
    .catch(err=>console.log(err.response.data.errMsg))
}


//STEM CATEGORY DROPDOWN MENU FOR FLASHCARDS -- FILTER
function handleMenuFilter(e){
        console.log(e.target.value)
        userAxios.get(`/api/learngame/learn/search/categorySTEM?categorySTEM=${e.target.value}`)
            .then(res => {
                setFlashcardState({flashcards: res.data})
                console.log("dropdown filtered data", res.data)
                console.log("flashcardState", flashcardState)
        })
              .catch(err=>console.log(err.response.data.errMsg))  
    }


//FILTER OUT ANSWERED QUESTION FROM GAME QUESTIONS ARRAY
function filterAnsweredQuestion(_id){
     setGameState(prevState=>({questions: prevState.questions.filter(question=> question._id !== _id)}))
}




//SEARCHBAR TERMS IN FLASHCARDS
function handleFlashcardSearch(e) {
    console.log("e.target.value", e.target.value)
    setSearchTerm({searchTerm: e.target.value})
    console.log("searchTerm", searchTerm)
    userAxios.get(`/api/learngame/learn/search?searchTerm=${e.target.value}`)
             .then(res => {
                setFlashcardState({flashcards: res.data})
                console.log("searchbar filtered data", res.data)
                console.log("flashcardState", flashcardState)
        })
              .catch(err=>console.log(err.response.data.errMsg))  
    }



//ADD FLASHCARD
    function addFlashcard(newFlashcard) {
        userAxios.post("/api/learngame/learn", newFlashcard)
          .then(res => {
            console.log(res)
            setFlashcardState(prevState => ({
                ...prevState,
                flashcardState:  [...prevState.flashcards, res.data]
            }))
        })
        .catch(err=>console.log(err.response.data.errMsg))
    }

    
    return (
        <LearnGameContext.Provider
            value={{
            ...flashcardState,
            getFlashcards,
            addFlashcard,
            ...gameState,
            getGameQuestions,
            handleGameAnswerClick,
            gameScore,
            saveMyScore,
            getMyGameScores,
            myScores,
            badgeReward,
            badgesAwarded,
            getBadgeCount,
            questionsAnswered,
            questionsCorrect,
            handleMenuFilter,
            gameReset,
            toggleModal,
            isModalOpen,
            handleFlashcardSearch
          
            
        }}>

        {props.children}


        </LearnGameContext.Provider>

    )

}
