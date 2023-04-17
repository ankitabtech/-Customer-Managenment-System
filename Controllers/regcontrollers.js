const Reg=require('../models/reg')
const bcrypt=require('bcrypt')
const nodemailer=require('nodemailer')
//const { findByIdAndUpdate } = require('../models/reg')



exports.insertreg=async(req,res)=>{
   //console.log(req.body)
   const{us,pass,email}=req.body
   const convertpass=await bcrypt.hash(pass,10)
   const usercheck=await Reg.findOne({username:us})
  // console.log(usercheck)
  if(usercheck==null){
    const record=new Reg({username:us,password:convertpass,email:email})
  await record.save()
  console.log(record)
  
  }else{
    res.send(`${us} username is already taken`)
  }
}
exports.loginshow=(req,res)=>{
    res.render('login.ejs',{message:''})
}

exports.logout=(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
  }

  exports.adminloginshow=(req,res)=>{
    res.render('admin/login.ejs')
  }

  exports.adminlogincheck=async(req,res)=>{
    const{us,pass}=req.body
    const record=await Reg.findOne({username:us})
    console.log(record)
    if(record!==null){
      res.redirect('/admin/dashboard')
    }
    else{
      res.redirect('/admin/')
    }

  }
  exports.admindashboardshow=(req,res)=>{
    res.render('admin/dashboard')
  }

  exports.adminlogout=(req,res)=>{
    req.session.destroy
    res.redirect('/admin/')
  }
  exports.adminusershow=async(req,res)=>{
    const record=await Reg.find().sort({creations_date:-1})
    const totalusers=await Reg.count()
   const totalactive= await Reg.count({status:'active'})
   const totalsuspended= await Reg.count({status:'suspended'})
    res.render('admin/user.ejs',{record,totalusers,totalactive,totalsuspended})
  }
  exports.adminuserstatusupdate=async(req,res)=>{
    const id=req.params.id
    const record=await Reg.findById(id)
    let newstatus=null
    if(record.status=='suspended'){
      newstatus='active'
    }else{
      newstatus='suspended'
    }
    await Reg.findByIdAndUpdate(id,{status:newstatus})
    res.redirect('/admin/users')
  

    }

    exports.adminroleupdate=async(req,res)=>{
      const id=req.params.id
      const record=await Reg.findById(id)
      console.log(record)
      let newrole=null
      if(record.role=='public'){
        newrole='pvt'

      }else{
        newrole='public'
      }
      await Reg.findByIdAndUpdate(id,{role:newrole})
      res.redirect('/admin/users')
    }
    exports.homepage=(req,res)=>{
      // console.log(sess.username)
   // console.log(req.session)
    const username=req.session.username
    res.render('index.ejs',{username})
   }
   exports.profile=async(req,res)=>{
    const username=req.session.username
    const record=await Reg.findOne({username:username})
    res.render('profile.ejs',{record,username})
   }
   exports.profileupdate=async(req,res)=>{
    const username=req.session.username
    const filename=req.file.filename
    const{fname,lname,email,mobile}=req.body
    await Reg.findOneAndUpdate(username,{firstname:fname,lastname:lname,email:email,mobile:mobile,img:filename})
    res.redirect('/profile')
   }
   exports.passrestshow=(req,res)=>{
    const username=req.session.username
    res.render('restform.ejs',{username})
   }
   exports.passrest=async(req,res)=>{
    const username=req.session.username
 const {cpass,npass}=req.body
 const newpassword=await bcrypt.hash(npass,10)
    const record=await Reg.findOne({username:username})
    //console.log(record)
    const comparepass=await bcrypt.compare(cpass,record.password)
    console.log(comparepass)
    if(comparepass){
      await Reg.findOneAndUpdate(username,{password:newpassword})
      req.session.destroy()
      res.redirect('/login')
    }
    else{
      res.send("password not matched")
    }
   }
   exports.forgotform=(req,res)=>{
    res.render('forgotform.ejs')
   }
   exports.forgotuser=async(req,res)=>{
    const{us}=req.body
    const record=await Reg.findOne({username:us})
    const customeremail=record.email
    if(record.email!==''){
      const customeremail=record.email
     //-----smtp server 
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'ank763407@gmail.com', // generated ethereal user
      pass: 'xgleqtdwhrqpfkhx', // generated ethereal password
    },
  });
  console.log("connected to smtp server")
  let info = await transporter.sendMail({
    from: 'ank763407@gmail.com', // sender address
    to: customeremail, // list of receivers
    subject: "password link from website", // Subject line
   // text: "Hello world?", // plain text body
    html: `<a href=http://localhost:5000/forgotlink/${us}>click link to change password</a>`, // html body
  });
  res.redirect('/login')
     
    }
   }
   exports.forgotlink=(req,res)=>{
    const user=req.params.username
    res.render('forgotlink.ejs',{user})
   }
   exports.forgotlinkrecord=async(req,res)=>{
    const user=req.params.user
    const record=await Reg.findOne({username:user})
   // console.log(record)
    //console.log(user)
    const{npassword}=req.body
    const convertpass=await bcrypt.hash(npassword,10)
    await Reg.findByIdAndUpdate(record.id,{password:convertpass})
    res.send("sucessfully password change")
   }