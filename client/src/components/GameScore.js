import React, { useContext} from "react"
import { LearnGameContext } from "../context/LearnGameProvider.js"



export default function GameScore() {



const {
    gameReset,
    gameScore,
    questionsAnswered,
    questionsCorrect,
    badgeReward,
    saveMyScore
} = useContext(LearnGameContext)



    return (
        <div className="game-score">
       
            <h2>✨Points✨{" "}{gameScore}{" "}{" "}</h2>
            <h2>🙋{" "}{questionsAnswered}</h2>
            <h2>✅{" "}{questionsCorrect}</h2>

     
            <h2>✨New Badges✨ {" "} {badgeReward} </h2>

            <button className="game-reset-btn" onClick={gameReset}>New Game</button>
            <button className="save-game-btn" onClick={()=>saveMyScore(gameScore)}>Save My Score</button>
       
        </div>
    )
}