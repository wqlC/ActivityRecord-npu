// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {

  let {
    stuId,
    userInfo
  } = event;

  //创建学号对应的活动记录数据库
  try {
    const db = cloud.database();
    return await db.createCollection(event.stuId);
  } catch (e) {
    return {
      code: 1,
      msg: e.message
    }
  };

  return {
    code: 0,
    data: {
      text: "add collection",
      stdId: event.stdId
    }
  };
}