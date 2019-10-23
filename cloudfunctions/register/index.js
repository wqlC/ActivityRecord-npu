// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {

  let {
    name,
    stuId,
    score,
    userInfo
  } = event;

  let openId = userInfo.openId;//添加博客者的openID
  let result = null;

  try {
    //引用数据库
    const db = cloud.database();
    const collection = db.collection('user');
    result = await collection.add({
      data: {
        name,
        stuId,
        score,
        _openId: openId
      }
    });
  } catch (e) {
    return {
      code: 1,
      msg: e.message
    };
  };

  // //创建学号对应的活动记录数据库
  // try {
  //   const db = cloud.database();
  //   return await db.createCollection(event.stuId);
  // } catch (e) {
  //   return {
  //     code: 2,
  //     msg: e.message
  //   }
  // };

  return {
    code: 0,
    data: {
      text: "add user",
      stdId: event.stdId
    }
  };
}