const mongoose=require('mongoose')

const testiSchema=mongoose.Schema({
    img:String,
    quote:String,
    name:String

})


module.exports=mongoose.model('testi',testiSchema)