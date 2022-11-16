const express = require("express");
const router = express.Router();

//导入级联导航路由处理函数对应的模块
const typeNav_handler = require("../router_handler/typeNav");

router.get('/product/getBaseCategoryList',typeNav_handler.getCategories)
module.exports = router;
