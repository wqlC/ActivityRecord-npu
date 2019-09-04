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

  // try {
  //   //引用数据库
  //   const db = cloud.database();
  //   const collection = db.collection(stuId);
  //   result = await collection.add({
  //     data: {
  //       id,
  //       activity,
  //       timestamp,
  //     }
  //   });
  // } catch (e) {
  //   return {
  //     code: 1,
  //     msg: e.message
  //   };
  // };

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
        data: db.command.push([{id, activity, timestamp}])
      }
    });
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
    data: {
      text: "add activity"
    }
  };
}