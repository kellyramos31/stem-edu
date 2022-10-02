const express = require("express");
const { isValidObjectId } = require("mongoose");
const forumPostRouter = express.Router();
const Post = require("../models/post.js");
const Comment = require("../models/comment.js");

//GET ALL POSTS ALTERNATIVE including populate _comments AND SORT BY # OF COMMENTS ON POST
forumPostRouter.get("/", (req, res, next) => {
  Post.find({})
    .populate("_comments")
    .sort({ numberCommentsOnPost: -1 })
    .exec((err, posts) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      return res.status(201).send(posts);
    });
});

//GET POST FOR INDIVIDUAL USER -- NOTE:  this sorts the post, but doesn't give user specific post now.

forumPostRouter.get("/user", (req, res, next) => {
  const ObjectId = require("mongodb").ObjectId; //problem with matching the ID(this solution is from Stack Overflow)
  Post.aggregate(
    [
      { $match: { _user: new ObjectId(req.user._id) } }, //problem with matching the ID(this solution is from Stack Overflow)
      { $sort: { numberCommentsOnPost: -1 } },
      {
        $lookup: {
          from: "comments",
          localField: "_comments",
          foreignField: "_id",
          as: "userComments",
        },
      },
    ],
    (err, sortedUserPosts) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      return res.status(200).send(sortedUserPosts);
    }
  );
});

//ADD NEW FORUM POST
forumPostRouter.post("/", (req, res, next) => {
  req.body._user = req.user._id;
  const post = new Post(req.body);
  post.save(function (err, newPost) {
    if (err) {
      res.status(500);
      return next(err);
    }
    return res.status(201).send(newPost);
  });
});

//GET ONE POST
forumPostRouter.get("/:postId", (req, res, next) => {
  Post.findById(req.params.postId, (err, post) => {
    if (err) {
      res.status(500);
      return next(err);
    } else if (!post) {
      res.status(404);
      return next(new Error("No post found."));
    }
    return res.send(post);
  });
});

//EDIT FORUM POST
forumPostRouter.put("/:postId", (req, res, next) => {
  Post.findByIdAndUpdate(
    { _id: req.params.postId, _user: req.user._id },
    req.body,
    { new: true },
    (err, post) => {
      if (err) {
        console.log("Error");
        res.status(500);
        return next(err);
      }
      return res.send(post);
    }
  );
});

//DELETE ISSUE--this works but leaves comments with no issue
// issueRouter.delete("/:issueId", (req, res, next)=> {
//     Issue.findOneAndDelete(
//     { _id: req.params.issueId, _user: req.user._id },
//     (err, deletedIssue) => {
//         if (err) {
//             res.status(500);
//             return next(err);
//         }
//         return res.status(200).send(`Successfully deleted: ${deletedIssue.title}`);
//     })
// })

//DELETE A FORUM POST -- INCLUDING ITS ASSOCIATED COMMENTS
forumPostRouter.delete("/:postId", (req, res, next) => {
  Post.findByIdAndDelete(
    { _id: req.params.postId, _user: req.user._id },
    (err, deletedPost) => {
      if (err) {
        res.status(500);
        return next(err);
      }

      Comment.deleteMany({ _post: req.params.postId }, (err, comments) => {
        if (err) {
          res.status(500);
          return next(err);
        }

        return res
          .status(200)
          .send(`Successfully deleted: ${deletedPost.title}`);
      });
    }
  );
});

//INCREMENT TOTAL # OF COMMENTS ON POST
forumPostRouter.put("/increment/:postId", (req, res, next) => {
  req.body._user = req.user._id;

  const postId = req.params.postId;

  Post.findByIdAndUpdate(
    { _id: postId, _user: req.user._id },
    { $inc: { numberCommentsOnPost: 1 } },
    { new: true },
    (err, updatedPost) => {
      if (err) {
        console.log("Error");
        res.status(500);
        return next(err);
      }
      return res.send(updatedPost);
    }
  );
});

//DELETE specified comment from _comments array for specific post
// forumPostRouter.put("/deleteCommentFromPost/:postId", (req, res, next)=> {
//         const commentId = req.body._id
//         const ObjectId = require('mongodb').ObjectId
//         Post.findByIdAndUpdate(
//             {_id: req.params.postId, _user: req.user._id},
//             { $pull: { "_comments": commentId}},

//         (err, updatedPost) => {
//             if (err) {
//                 console.log("Error");
//                 res.status(500);
//                 return next(err);
//             }

//             return res.send(updatedPost)

//             //note:  appears to pull the commentId from the array in issues, but "updatedIssue res still shows comment id"
//         })
//     })

//DECREMENT TOTAL # OF COMMENTS ON POST
forumPostRouter.put("/decrement/:postId", (req, res, next) => {
  req.body._user = req.user._id;

  const postId = req.params.postId;

  Post.findByIdAndUpdate(
    { _id: postId, _user: req.user._id },
    { $inc: { numberCommentsOnPost: -1 } },
    { new: true },
    (err, updatedPost) => {
      if (err) {
        console.log("Error");
        res.status(500);
        return next(err);
      }
      return res.send(updatedPost);
    }
  );
});

//TOTAL # OF COMMENTS FOR SPECIFIC POST
forumPostRouter.get("/countComments/:postId", (req, res, next) => {
  Post.aggregate([
    // {$match: {_id: req.params.issueId}},
    {
      $project: {
        count: { $size: "_comments" },
      },
    },
  ]),
    (err, commentCount) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      return res.status(200).send(commentCount);
    };
});

//SEARCH POSTS BY STEM CATEGORY (for dropdown menu)
forumPostRouter.get("/search/category", (req, res, next) => {
  const { category } = req.query;
  const pattern = new RegExp(category);
  Post.find(
    { category: { $regex: pattern, $options: "i" } },
    (err, categories) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      return res.status(200).send(categories);
    }
  );
});

//SEARCH BAR FOR POSTS ON FORUM PAGE
//CREATED TEXT INDEX INSIDE MONGODB FOR POST TEXT FIELDS (category, title, description)
forumPostRouter.get("/search/userterm", (req, res, next) => {
  const { searchTerm } = req.query;
  //changed logic here to work with Atlas--NOTE: right now this works for exact matches (but not partial matches)
  Post.aggregate(
    [
      {
        $search: {
          index: "posts",
          text: {
            query: searchTerm,
            path: ["title", "description"],
          },
        },
      },
    ],
    //this worked when it was Compass
    // Post.find(
    //   { $text: { $search: searchTerm } },

    (err, posts) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      return res.status(200).send(posts);
    }
  );
});

module.exports = forumPostRouter;
