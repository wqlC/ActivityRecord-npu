// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    id,
    stuId,
    userInfo
  }=event;
  console.log("event:", event);

  timeStamp_today = new Date().setHours(0, 0, 0, 0);
  // timeStamp_today /= 1000;
  timeStamp_today = parseInt(timeStamp_today);
  console.log("today is: ", timeStamp_today);
  let id_today = 0;
  let result = null;
  try{
    const db = cloud.database();
    const collection = db.collection(stuId);
    result = await collection.where({
      id: id,
      timestamp: db.command.gte(timeStamp_today)
    }).count()
    // .then(res => {
    //   console.log("res.data: ", res.total);
    //   id_today = res.total;
    // });
  }catch(e){
    return {
      code : 1,
      msg: e.message
    }
  }

  // console.log("id_today: ", id_today);

  return {
    code: 0,
    data: result
  }
}