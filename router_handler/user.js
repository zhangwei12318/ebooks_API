const db = require("../db/index");
const jwt = require("jsonwebtoken");
const config = require("../config");
//加密
const bcrypt = require("bcryptjs");

//登录处理函数
exports.login = (req, res) => {
  userInfo = req.body;
  const sql = "select * from user where uname=?";
  db.query(sql, userInfo.username, (err, result) => {
    if (err) return res.cc(err);
    if (result.length != 1) return res.cc("账号或密码错误！");
    //判断密码是否正确
    if (bcrypt.compareSync(userInfo.password, result[0].upassword)) {
      const user = { ...result[0], upassword: "" };
      //生成token
      const token = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: config.expiresIn,
      });
      //响应
      res.send({
        status: 200,
        message: "登录成功",
        token: "Bearer " + token,
      });
    } else {
      res.cc("账号或密码错误！");
    }
  });
};

//注册处理函数
exports.register = (req, res) => {
  const userInfo = req.body;
  const sql = "select * from user where uname=?";
  db.query(sql, userInfo.username, (err, results) => {
    if (err) return res.cc(err);
    if (results.length > 0) return res.cc("用户名已存在");
    //对密码进行加密
    userInfo.password = bcrypt.hashSync(userInfo.password, 10);
    const sqlStr = "insert into user set ?";
    db.query(
      sqlStr,
      { uname: userInfo.username, upassword: userInfo.password },
      (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1)
          return res.cc("注册用户失败，请稍后再试！");
        res.cc("注册成功！", 200);
      }
    );
  });
};
