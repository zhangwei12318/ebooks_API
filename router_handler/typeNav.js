//导入数据库模块
const db = require("../db/index");

exports.getCategories = (req, res) => {
  const sql1 = "SELECT * from categories";
  const sql2 = "select * from category_children";
  const sql3 = "select * from category_grandson";
  //请求一级数据
  db.query(sql1, (err, results1) => {
    if (err) return res.cc(err);
    if (results1.length < 1) return res.cc("获取导航栏数据失败！");
    //请求二级数据
    db.query(sql2, (err, results2) => {
      if (err) return res.cc(err);
      if (results2.length < 1) return res.cc("获取导航栏数据失败！");
      //请求三级数据
      db.query(sql3, (err, results3) => {
        if (err) return res.cc(err);
        if (results3.length < 1) return res.cc("获取导航栏数据失败！");
        //把三级数据添加进二级数据里
        for (var j = 0; j < results3.length; j++) {
          results2.forEach((obj) => {
            if (obj.children_id === results3[j].child_id) {
              if (!obj.children) {
                obj.children = [results3[j]];
              } else {
                obj.children.push(results3[j]);
              }
            }
          });
        }
        //把二级数据添加进一级数据里
        for (var i = 0; i < results2.length; i++) {
          results1.forEach((obj) => {
            if (obj.category_id === results2[i].cid) {
              if (!obj.children) {
                obj.children = [results2[i]];
              } else {
                obj.children.push(results2[i]);
              }
            }
          });
        }
        res.send({
          status: 200,
          message:"获取导航栏数据成功！",
          data: results1,
        });
      });
    });
  });
};

