import React, { useContext, useEffect } from "react"
import { LearnGameContext } from "../context/LearnGameProvider.js"
import Flashcard from "./Flashcard.js"
import DropMenuFlashcards from "./DropMenuFlashcards.js"
import SearchBarCards from "./SearchBarCards.js"




export default function Learn(props) {

  const {
    getFlashcards,
    flashcardState,
    handleFlashcardSearch,
    flashcards
} = useContext(LearnGameContext)

//USEEFFECT
useEffect(() => {
    console.log("useEffect in Learn Component to get Flashcards triggered")
    getFlashcards()
    // eslint-disable-next-line  
  }, [flashcardState])



    
 
    return(
      <div>
          <h3 className="title-learn-page">Let's Learn About Women in STEM!</h3>
      
          <div className="learn-container">
    
                <div className="dropdown-flashcards">
                  <DropMenuFlashcards/>
                </div>

                <div className="searchbar-flashcards">
                  <SearchBarCards
                    handleFlashcardSearch={handleFlashcardSearch}
                  />
                </div>

                <div className="flashcard-learn-container">
                    {flashcards.map(flashcard=> 
                        <Flashcard flashcard={flashcard} key={flashcard._id}/>
                    )}
                </div>

          </div>

      </div>
            )
    }
        
         