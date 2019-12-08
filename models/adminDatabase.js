const mongoose = require('mongoose');
var bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

let TweetSchema = new Schema ({

    adminFirstName:{
        type: String,
        required: true,
    },

    adminLastName:{
        type: String,
        required: true,
    },

    adminEmail:{
        type: String,
        required: true,
    },
    adminPhone:{
        type: String,
        required: true,
    },

    adminPassword:{
        type: String,
        required: true,
    },

    createdDate:{
        type: Date,
        default: Date.now
    }
})

TweetSchema.methods.hashPassword = function(adminPassword){
    return bcrypt.hashSync(adminPassword, bcrypt.genSaltSync(10))
}

TweetSchema.methods.comparePassword = function(adminPassword, hash){
    return bcrypt.compareSync(adminPassword, hash)
}

module.exports = mongoose.model('admin', TweetSchema);