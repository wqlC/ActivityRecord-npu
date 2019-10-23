// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    id,
    activity,
    timestamp,
    stuId,
    userInfo
  } = event;
  console.log("event: ", event);
  console.log("id: ", id);
  console.log("activity: ", activity);
  console.log("timestamp: ", timestamp);
  let result = null;
  let resultAdd = null;
  

  //往 user 里面添加活动记录
  try {
    //引用数据库
    const db = cloud.database();
    const collection = db.collection('user');
    result = await collection.where(
      {
        stuId: stuId
      }
    ).update({
      data: {
        data: db.command.push([{id, activity, timestamp}]),
      }
    });

    //向学号表中添加对应记录
    result = await db.collection(stuId).add({
        data:{
          id: id,
          activity: activity,
          timestamp: timestamp
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
}