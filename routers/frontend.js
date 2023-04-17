const router=require('express').Router()
const regc=require('../controllers/regcontrollers')
const testic=require('../controllers/testcontrollers')
const Reg=require('../models/reg')
const bcrypt=require('bcrypt')
const multer=require('multer')


function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/login')
    }
}
function handlerole(req,res,next){
  if(req.session.role=='pvt'){
   next()
  }else{
    res.send('you dont have right to see this page')
  }
//console.log(req,res,next)
}
let storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./public/upload')
  },
  filename:function(req,file,cb){
    cb(null, Date.now +file.originalname)
  }
})
let upload=multer({
  storage:storage,
  limits:{filesize:1024*1024*4}
})

router.get('/',handlelogin,regc.homepage)
router.get('/reg',(req,res)=>{
    
    res.render('reg.ejs')
})
router.post('/regrecords',regc.insertreg)
router.get('/login',regc.loginshow)
router.post('/loginrecord',async(req,res)=>{
  const{us,pass}=req.body
  const record=await Reg.findOne({username:us})
 console.log(record)
 if(record.status=='active'){
 if(record!==null){
  const passwordcompaerd=await bcrypt.compare(pass,record.password)
  if(passwordcompaerd){
    req.session.isAuth=true
    sess=req.session
    sess.username=us
    sess.role=record.role
    //console.log(sess.username)
  res.redirect('/')
  }else{
    res.redirect('/login')
  }
 }
 else{
 res.redirect('/login')
 }
}

else{
  res.send('Your account is suspended.please cordinate with admin')

}

}
)



router.get('/logout',regc.logout)
router.get('/testi',handlelogin,handlerole,testic.showpage)
router.get('/profile',handlelogin,regc.profile)
router.post('/profilerecord',handlelogin,upload.single('img'),regc.profileupdate)
 router.get('/passreset',regc.passrestshow) 
 router.post('/resetrecord',regc.passrest)
router.get('/forgot',regc.forgotform)
router.post('/forgotuser',regc.forgotuser)
router.get('/forgotlink/:username',regc.forgotlink)
router.post('/forgotlinkrecord/:user',regc.forgotlinkrecord)
module.exports=router;