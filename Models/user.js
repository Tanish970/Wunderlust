const mongoose = require('mongoose');
const Scheme=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema = new Scheme({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
