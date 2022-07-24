const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const expressJwt = require("express-jwt"); //gatekeeper
const port = process.env.PORT || 5000;
const path = require("path");

//note: updates to syntax for line above would be {expressjwt} so it's a named import
//& then would need to change line 26 to match casing -- expressjwt.
// Also, on line 26, (already had it), have to add "algorithms: ['HS256'] in the object

//************OTHER UPDATE: req.user is now req.auth************

app.use(express.json());
app.use(morgan("dev"));

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
  },
  () => console.log("Connected to the DB")
);

app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/auth", require("./routes/authRouter.js"));
app.use(
  "/api",
  expressJwt({ secret: process.env.SECRET, algorithms: ["HS256"] })
); //creates req.user(now req.auth) -- ALSO:  algorithms: for express-jwt v6.0.0 & higher: adding an algorithm parameter is now required in addition to the secret.
//note: expressJwt line above checks to see if token has SECRET that
//matches the one on the server => for any route beginning with /api;SO--the 3 routes below are protected

app.use("/api/forumpost", require("./routes/forumPostRouter.js"));
app.use("/api/comment", require("./routes/commentRouter.js"));
app.use("/api/learngame", require("./routes/learnGameRouter.js"));

app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "UnauthorizedError") {
    //this is for when no token available
    res.status(err.status);
  }
  return res.send({ errMsg: err.message });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log("Server is running on local port 5000");
});
