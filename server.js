const express=require('express')
const app=express()
const session=require('express-session')
app.use(express.urlencoded({extended:false}))
require('dotenv').config()
const adminRouter=require('./routers/admin')
const frontendRouter=require('./routers/frontend')
const mongoose=require('mongoose')
mongoose.connect(process.env.DB_URL+'/'+process.env.DB_NAME)


app.use(session({
secret:'Abc',
saveUninitialized:'false',
resave:false,
//cookie:{maxAge:1000*60*60*24*365}
}))
app.use(frontendRouter)

app.use('/admin',adminRouter)
app.use(express.static('public'))
app.set('view engine','ejs')
app.listen(process.env.PORT,()=>{
    console.log(`server is running on port${process.env.PORT}`)
})