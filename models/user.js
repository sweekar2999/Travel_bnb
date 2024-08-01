const { required } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongose=require('passport-local-mongoose');
const Schema = mongoose.Schema;
const userSchema= new Schema({
    
    email:{
        type:String,
        required:true
    }
});
userSchema.plugin(passportLocalMongose);
module.exports=mongoose.model("User",userSchema);