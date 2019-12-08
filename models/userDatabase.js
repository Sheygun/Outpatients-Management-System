const mongoose = require('mongoose');
var bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

let TweetSchema = new Schema ({

    firstName:{
        type: String,
        required: true,
    },

    lastName:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },

    address: String,
    gender: String,
    dob:String,
    state:String,
    country:String,
    lg:String,
    town: String,
    occupation: String,
    bloodGroup: String,
    genotype: String,
    marital: String,

    password:{
        type: String,
        required: true,
    },

    createdDate:{
        type: Date,
        default: Date.now
    }
})

TweetSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

TweetSchema.methods.comparePassword = function(password, hash){
    return bcrypt.compareSync(password, hash)
}

module.exports = mongoose.model('user', TweetSchema);