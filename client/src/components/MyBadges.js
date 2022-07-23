import React from "react"
import { GiRingedPlanet } from 'react-icons/gi'

export default function MyBadges(props) {

const {
    badgesAwarded
    } = props



return (

    <div className="my-badge-awards">

        <h3 className="my-badges-title">My Badge Count</h3>

        <h4>{badgesAwarded.badgeCount}</h4>

        <p className="reward-icons"> {Array(badgesAwarded.badgeCount).fill(<GiRingedPlanet key={badgesAwarded._id}/>)} </p>

    </div>
)}