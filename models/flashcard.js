const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const flashcardSchema = new Schema({
    categorySTEM: {
    type: String,
    required: true
    },
    title: {
        type: String
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    quote: {
        type: String
    },
    born: {
        type: String
    },
    alive: {
        type: Boolean,
        required: true
    },
    profession1: {
        type: String,
        required: true
    },
    profession2: {
        type: String
    },
    profession3: {
        type: String
    },
    knownFor: {
        type: String,
        required: true
    },
    fact1: {
        type: String,
        required: true
    },
    fact2: {
        type: String
    },
    fact3: {
        type: String
    },
    fact4: {
        type: String
    },
    fact5: {
        type: String
    },
    quote1:  {
        type: String
    },
    quote2: {
        type: String
    },
    quote3: {
        type: String
    },
    imageURL: {
        type: String
    },
    imageAttribution: {
        type: String
    }
})



module.exports = mongoose.model("Flashcard", flashcardSchema)