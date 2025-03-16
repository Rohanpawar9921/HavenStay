const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;



// Passport-Local Mongoose will add a username, hash and salt field to store the username,
// the hashed password and the salt value. Hence we are just creating the email field
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
})


// this is required because it create username and  password with salting and hashing automatically
userSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model("user", userSchema);