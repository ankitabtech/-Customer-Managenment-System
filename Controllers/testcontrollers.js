const Testi=require('../models/testi')






exports.showpage=(req,res)=>{
    console.log(req.session)
const username=req.session.username
    res.render('testi.ejs',{username})  
}
