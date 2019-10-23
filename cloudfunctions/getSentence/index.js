// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    id,
    userInfo
  } = event;

  let result = null;
  let index = Math.round(Math.random() * Math.round(9));
  // index = 0;
  let key = "sen" + id;
  console.log("key is: ", key);
  console.log("index is: ", index);

  try {
    const db = cloud.database();
    result = await db.collection(key).where({
      index: index
    }).get();
    console.log("result: ", result);
  } catch (e) {
    return {
      code: 1,
      msg: e.message
    };
  };
  return {
    code: 0,
    data: result
  }
}