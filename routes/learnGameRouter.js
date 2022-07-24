const express = require("express");
const { isValidObjectId } = require("mongoose");
const learnGameRouter = express.Router();
const Flashcard = require("../models/flashcard.js");
const Question = require("../models/question.js");
const Score = require("../models/score.js")
const User = require("../models/user.js")

//GET ALL FLASHCARDS
learnGameRouter.get("/learn", (req, res, next) => {
Flashcard.find((err, flashcards) => {
        if (err) {
            res.status(500);
            return next(err);
        }
        return res.send(flashcards);
    });
});


//ADD A FLASHCARD
//*******************figure out way to limit this to ADMIN/TEACHER*******
learnGameRouter.post("/learn", (req, res, next) => {
    req.body._user = req.user._id
    const flashcard = new Flashcard(req.body);

    flashcard.save(function(err, newFlashcard) {
        if (err) {
            res.status(500)
            return next(err)
        }
                 
        return res.status(201).send(newFlashcard);
    })
})

//EDIT A FLASHCARD
learnGameRouter.put("/learn/:flashcardId", (req, res, next) => {
    Flashcard.findByIdAndUpdate(
        {_id: req.params.flashcardId, _user: req.user._id},
        req.body,
        { new: true },
        (err, flashcard) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(flashcard);
        })
})

//DELETE A FLASHCARD
learnGameRouter.delete("/learn/:flashcardId", (req, res, next)=> {
    Flashcard.findOneAndDelete(
    { _id: req.params.flashcardId, _user: req.user._id },
    (err, deletedFlashcard) => {
        if (err) {
            res.status(500);
            return next(err) 
        }
        return res.status(200).send(`Successfully deleted comment: ${deletedFlashcard.firstName}${deletedFlashcard.lastName}`);
    })
})

//GET ALL GAME QUESTIONS
learnGameRouter.get("/play", (req, res, next) => {
Question.find((err, questions) => {
        if (err) {
            res.status(500);
            return next(err);
        }
        return res.send(questions);
    });
});

//ADD A GAME QUESTION
learnGameRouter.post("/play", (req, res, next) => {
    req.body._user = req.user._id
    const question = new Question(req.body);

    question.save(function(err, newQuestion) {
        if (err) {
            res.status(500)
            return next(err)
        }
                 
        return res.status(201).send(newQuestion);
    })
})


//EDIT A GAME QUESTION
learnGameRouter.put("/play/:questionId", (req, res, next) => {
    Question.findByIdAndUpdate(
        {_id: req.params.questionId, _user: req.user._id},
        req.body,
        { new: true },
        (err, question) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(question);
        })
})

//DELETE A GAME QUESTION
learnGameRouter.delete("/play/:questionId", (req, res, next)=> {
    Question.findOneAndDelete(
    { _id: req.params.questionId, _user: req.user._id },
    (err, deletedQuestion) => {
        if (err) {
            res.status(500);
            return next(err) 
        }
        return res.status(200).send(`Successfully deleted question: ${deletedFlashcard.answer}`);
    })
})


//GET ALL GAMESCORES (ALL USERS)
learnGameRouter.get("/play/score", (req, res, next) => {
Score.find((err, scores) => {
        if (err) {
            res.status(500);
            return next(err);
        }
        return res.send(scores);
    });
})


//ADD USER'S SCORE TO SCORE MODEL ARRAY OF ALL GAMESCORES
learnGameRouter.post("/play/score", (req, res, next) => {
    req.body._user = req.user._id
    // console.log("req.params.gameScore", req.params.gameScore)
    const score = new Score(req.body);
    score.save(function (err, newScore) {
        if (err) {
            res.status(500);
            return next(err);
        }
        return res.status(201).send(newScore);
    })
})

//DELETE SCORE FROM SCORE MODEL ARRAY
learnGameRouter.delete("/play/score/:scoreId", (req, res, next)=> {
        // const issueId = req.body._issue
        // const ObjectId = require('mongodb').ObjectId 
        Score.findOneAndDelete(
            {_id: req.params.scoreId, _user: req.user._id},
        (err, updatedScore) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(updatedScore);
        })
    })



//GET ALL GAMESCORES FOR SINGLE USER IN DESCENDING ORDER
learnGameRouter.get("/play/score/user", (req, res, next)=>{
    const ObjectId = require('mongodb').ObjectId            //problem with matching the ID(this solution is from Stack Overflow)   
    Score.aggregate([
       { $match: { _user: new ObjectId(req.user._id) } },  //problem with matching the ID(this solution is from Stack Overflow)
       { $sort: { scoreTotal: -1 } }
    ],
         (err, sortedUserScores)=> {
            if (err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(sortedUserScores)
    })
})


//INCREMENT USER'S BADGE COUNT
learnGameRouter.put("/play/badge/increment", (req, res, next) => {
req.body._user = req.user._id
User.findByIdAndUpdate(			
  {_id: req.user._id },	
  {$inc: {badgeCount: 1}},			
  {new: true},			
  (err, updatedCount)=> {			
      if(err){			
          res.status(500)			
          return next(err)			
      }			
      return res.status(201).send(updatedCount)			
   }			
  )			
})


//RETURN BADGECOUNT FIELD FOR USER
learnGameRouter.get("/play/badge/count", (req, res, next) => {
User.findOne({"_id" : req.user._id})
    .select('badgeCount')
    .exec((err, badgeCount)=> {

        if (err) {
            res.status(500);
            return next(err);
        }
        return res.status(201).send(badgeCount);
})
})




//SEARCH FLASHCARDS BY STEM CATEGORY (for dropdown menu)
learnGameRouter.get("/learn/search/categorySTEM", (req, res, next) => {
    const { categorySTEM } = req.query
    const pattern = new RegExp(categorySTEM)
    Flashcard.find({ categorySTEM: { $regex: pattern, $options: "i" } },
        (err, categories) => {
            if (err) {
                res.status(500)
                return next(err)
            }
            return res.status(200).send(categories)
        })
})


//??? HOW SEARCH MORE THAN ONE FIELD FOR TERMS???
//SEARCH FLASHCARDS FOR TYPED IN TERMS (for search box)
// learnGameRouter.get("/learn/search", (req, res, next) => {
//     const { searchTerm } = req.query
//     const pattern = new RegExp(searchTerm)
//     Flashcard.find(
//         {profession1: { '$regex': pattern, '$options': 'i' } },
//         // {profession2: { '$regex': pattern, '$options': 'i' } },
//         // {profession3: { '$regex': pattern, '$options': 'i' } },
     

//        (err, flashcards) => {
//             if (err) {
//                 res.status(500)
//                 return next(err)
//             }
//             return res.status(200).send(flashcards)
//         })
// })

//ANOTHER ATTEMPT AT CREATING SEARCH BAR ROUTE:
//CREATED TEXT INDEX INSIDE MONGODB FOR FLASHCARD TEXT FIELDS (note: all string fields except imageURL)
//*****note:  works great in testing inside mongodb -- figure out how to write/incorporate the query for router/frontend searchbar

learnGameRouter.get("/learn/search", (req, res, next)=> {
    const { searchTerm } = req.query
    Flashcard.find(
        {$text: {$search: searchTerm }},  
    (err, flashcards) =>{
        if(err) {
            res.status(500)
            return next(err)
   }
   return res.status(200).send(flashcards)
 })

})


module.exports = learnGameRouter;

