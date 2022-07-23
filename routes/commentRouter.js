const express = require("express");
const { isValidObjectId } = require("mongoose");
const commentRouter = express.Router();
const Comment = require("../models/comment.js");
const Post = require("../models/post.js");

//GET ALL COMMENTS
commentRouter.get("/", (req, res, next) => {
Comment.find((err, comments) => {
        if (err) {
            res.status(500);
            return next(err);
        }
        return res.send(comments);
    });
});

//GET COMMENTS FOR INDIVIDUAL USER
commentRouter.get("/user", (req, res, next)=>{
    Comment.find({_user: req.user._id}, (err, comments)=>{
        if(err) {
            res.status(500)
            return next(err)
        }
        console.log("comments", comments)
        return res.status(200).send(comments)
    })
})

//GET ALL COMMENTS FOR A SPECIFIC POST
commentRouter.get("/post/:postId", (req, res, next)=>{
    Comment.find({_post: req.params.postId}, (err, comments)=>{
        if(err) {
            res.status(500)
            return next(err)
        }
        console.log("all comments for specified post id", comments)
        return res.status(200).send(comments)
    })
})

//DELETE ALL COMMENTS FOR A SPECIFIC POST
commentRouter.delete("/post/:postId", (req, res, next)=>{
    Comment.deleteMany({_post: req.params.postId}, (err, comments)=>{
        if(err) {
            res.status(500)
            return next(err)
        }
        console.log("all comments for specified post id", comments)
        return res.status(200).send(comments)
    })
})


//COMBINES THE TWO ROUTES DIRECTLY ABOVE (THE ADD COMMENT & UPDATE COMMENTS ARRAY WITHIN ISSUES REQUESTS)***
//NOTE:  this is returning the issue with the comment, BUT -- NOT the comment
commentRouter.post("/", (req, res, next) => {
    req.body._user = req.user._id
    // req.body.username = req.user._id.username
      
    const comment = new Comment(req.body);

    comment.save(function(err, newComment) {
          if (err) {
            res.status(500)
            return next(err)
        }
   
    const postId = req.body._post
      
        Post.findByIdAndUpdate(
            {_id: postId, _user: req.user._id},
            { $push: { "_comments": newComment._id}},
            { new: true},
        (err, updatedPost) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(updatedPost);
        })
    })
})



//DELETE COMMENT -- this works but leaves comment ids still attached to parent issue in array
commentRouter.delete("/:commentId", (req, res, next)=> {
    Comment.findByIdAndDelete(
    { _id: req.params.commentId, _user: req.user._id },
    (err, deleted) => {
        if (err) {
            res.status(500);
            return next(err) 
        }
        return res.status(200).send(`Successfully deleted comment: ${deleted}`);
    })
})


//DELETE ALL COMMENTS FOR A SPECIFIED POST ID (in comments database it will be an _post)




//DELETE COMMENT from _comments array in post model-- 
//******this works on its own in Postman to delete an id from the _comments array for Post*******
commentRouter.put("/deleteCommentFromPost/:commentId", (req, res, next)=> {
        req.body._user = req.user._id
        const postId = req.body._post
       
        // const ObjectId = require('mongodb').ObjectId 
        Post.findByIdAndUpdate(
            {_id: postId, _user: req.user._id},
            { $pull: { "_comments": req.params.commentId}},
        (err, updatedPost) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(updatedPost);
        })
    })



//EDIT COMMENT
commentRouter.put("/:commentId", (req, res, next) => {
    Comment.findByIdAndUpdate(
        {_id: req.params.commentId, _user: req.user._id},
        req.body,
        { new: true },
        (err, comment) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(comment);
        })
})




module.exports = commentRouter;