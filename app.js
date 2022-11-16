const express = require("express");
const app = express();

//导入cors中间件解决跨域问题
const cors = require("cors");
app.use(cors());
// 配置解析表单数据的中间件,注意，这个中间件只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({ extended: false }));

//封装res.cc函数，处理响应失败回调
app.use((req, res, next) => {
  res.cc = (err, status = 201) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

//配置解析token的中间件
const { expressjwt: jwt } = require("express-jwt");
const config=require('./config');
app.use(jwt({secret: config.jwtSecretKey,algorithms: ["HS256"]}).unless({ path: [/^\/reguser/] }))

//导入并使用级联导航路由
const typeNavRouter = require("./router/typeNav");
app.use("/api", typeNavRouter);

//导入并使用登录注册路由
const userRouter = require("./router/user");
app.use('/reguser',userRouter);



//定义错误级别的中间件
app.use((err,req,res,next)=>{
  // 验证失败导致的错误
  if(err instanceof joi.ValidationError) return res.cc(err)
  //身份认真失败后的错误
  if(err.name==='UnauthorizedError') return res.cc('身份认证失败！')
  // 未知错误 
  res.cc(err)
})
app.listen(3000, () => {
  console.log("api server running at http://127.0.0.1:3000");
});
