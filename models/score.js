const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const scoreSchema = new Schema({

    scoreTotal: {
            type: Number
        },

    _user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

const autoPopulateUser  = function(next) {
    this.populate({
        path: "_user",
        select: "username _id"
    })
    next()
    }

scoreSchema.pre("find", autoPopulateUser)


module.exports = mongoose.model("Score", scoreSchema)