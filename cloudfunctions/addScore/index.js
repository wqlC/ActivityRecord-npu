// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    stuId,
    userInfo
  } = event;

  try {
    const db = cloud.database();
    const collection = db.collection('user');
    result = await collection.where(
      {
        stuId: stuId
      }
    ).update({
      data: {
        score: db.command.inc(1)
      }
    });
  } catch (e) {
    return {
      code: 1,
      msg: e.message
    };
  };
  return {
    code: 0,
    data: result
  };
};