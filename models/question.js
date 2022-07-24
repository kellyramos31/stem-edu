const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const questionSchema = new Schema({
    categorySTEM: {
        type: String,
        required: true
        },
    answer: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    questionOptions: [
        {
         questionText: {
            type: String,
            required: true
         },
         isCorrect: {
            type: Boolean,
            required: true,
            defaultValue: false
         },
      
        }
    ]

})



module.exports = mongoose.model("Question", questionSchema)