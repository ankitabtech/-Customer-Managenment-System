const router=require('express').Router()
const regc=require('../controllers/regcontrollers')

router.get('/',regc.adminloginshow)

router.post('/loginrecord',regc.adminlogincheck)
router.get('/dashboard',regc.admindashboardshow)
router.get('/logout',regc.logout)
router.get('/users',regc.adminusershow)
router.get('/userstatusupdate/:id',regc.adminuserstatusupdate)
router.get('/userroleupdate/:id',regc.adminroleupdate)

module.exports=router;