// 云函数入口
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    stuId,
    userInfo
  } = event;
  timeStamp_today = new Date().setHours(0, 0, 0, 0);
  timeStamp_today = parseInt(timeStamp_today);
  console.log("today is: ", timeStamp_today);
  let result = null;
  try {
    const db = cloud.database();
    const $ = db.command.aggregate
    const collection = db.collection(stuId);
    result = await collection.aggregate()
      .match({
        timestamp: db.command.gte(timeStamp_today)
      })
      .group({
        _id: '$id',
        num: $.sum(1)
      }).end()
  } catch (e) {
    return {
      code: 1,
      msg: e.message
    }
  }

  return {
    code: 0,
    data: result
  }
}