const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//const passportLocalMongoose = require("passport-local-mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
// define schema
const userSchema = new Schema({
   email: {
    type: String,
    required: true,
   },
});

// use isse username & hash password, hashing ,salting  created by default
userSchema.plugin(passportLocalMongoose.default); // <-- ".default" add karein must
module.exports = mongoose.model("User",userSchema);