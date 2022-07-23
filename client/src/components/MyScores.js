import React from "react"


export default function MyScores(props) {

const { myScores } = props

return (

    <div className="my-top-three-scores">

            <h3 className="top-scores-title">My Top 3 Game Scores</h3>

                {myScores.slice(0,3).map(score => (
                   <h4 key={score._id}>✨{score.scoreTotal}{" "}points✨</h4>
                ))}

    </div>

)

}