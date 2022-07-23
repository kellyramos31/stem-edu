import React, { useContext} from "react"
import { LearnGameContext } from "../context/LearnGameProvider.js"

export default function DropMenuFlashcards(props) {

const {
    handleMenuFilter,
    getFlashcards
} = useContext(LearnGameContext)

    return (
        <div>
            
            <div className="dropdown-menu">

                <h5 className="dropdown-title">Flashcards By Category</h5>

                <select onChange={handleMenuFilter} className="dropdown">
                    <option>--Select a Category--</option>
                    <option value="Science">Science</option>
                    <option value="Tech">Tech</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Math">Math</option>
                </select>

                <button className="return-to-all-flashcards-btn" onClick={getFlashcards}>View All Flashcards</button>

            </div>

        </div>
    )
}

