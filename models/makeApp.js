const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let TweetSchema = new Schema ({

    department:{
        type: String,
        required: true,
    },

    doctor:{
        type: String,
        required: true,
    },
    health: String,
    regNum: String,

    createdDate:{
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('make-appointment', TweetSchema);