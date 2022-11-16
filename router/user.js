const express =require('express')
const router=express.Router()

const user_handler=require('../router_handler/user')
//登录
router.post('/login',user_handler.login)
//注册
router.post('/resgiter',user_handler.register)

module.exports=router