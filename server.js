const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const expressJwt = require("express-jwt"); //gatekeeper
const path = require("path");
const port = process.env.PORT || 5000;

//note: updates to syntax for line above would be {expressjwt} so it's a named import
//& then would need to change line 26 to match casing -- expressjwt.
// Also, on line 26, (already had it), have to add "algorithms: ['HS256'] in the object

//************OTHER UPDATE: req.user is now req.auth************

app.use(express.json());
app.use(morgan("dev"));

//prior mongoose.connect for Heroku
// mongoose.connect(
//   process.env.MONGODB_URI,
//   {
//     useNewUrlParser: true,
//   },
//   () => console.log("Connected to the DB")
// );


//from cyclic docs:
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/auth", require("./routes/authRouter.js"));
app.use(
  "/api",
  expressJwt({ secret: process.env.SECRET, algorithms: ["HS256"] })
);

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


//From cyclic docs:  Routes go here
// app.all('*', (req,res) => {
//     res.json({"every thing":"is awesome"})
// })


//prior app.listen with Heroku
// app.listen(port, () => {
//   console.log("Server is running on local port 5000");
// });


//From cyclic docs --> Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})
