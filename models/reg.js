const mongoose=require('mongoose')

const regSchema=mongoose.Schema({
    username:String,
    password:String,
    firstname:String,
    lastname:String,
    email:String,
    mobile:String,
    img:String,
    creation_date:{type:Date,default:new Date()},
    status:{type:String,default:'suspended'},
    role:{type:String,default:'public'}
})



module.exports=mongoose.model('reg',regSchema)