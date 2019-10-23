// 云函数入口文件
// 获取每一个id对应的点击限制：
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    id,
    stuId,
    userInfo
  } = event;

  console.log("id: ", id);
  id = parseInt(id);

  let result = null;
  let id_max = 0;
  try {
    result = await cloud.database().collection('maxValueSet').where({
      data: {
        id: id
      }
    }).get().then(res => {
      console.log("res.data: ", res.data[0].data.max_value);
      id_max = res.data[0].data.max_value;
    });
  } catch (e) {
    return {
      code: 1,
      msg: e.message
    };
  };

  console.log("id_max: ", id_max);

  timeStamp_today = new Date().setHours(0, 0, 0, 0);
  timeStamp_today = parseInt(timeStamp_today);
  console.log("today is: ", timeStamp_today);
  let id_today = 0;
  try {
    result = await cloud.database().collection(stuId).where({
      id: id,
      timestamp: cloud.database().command.gte(timeStamp_today)
    }).count().then(res => {
      console.log("res.data: ", res); //得到的结果总是为0---不知道为什么
      id_today = res.total;
    });
  } catch (e) {
    return {
      code: 1,
      msg: e.message
    }
  }
  console.log("id_today: ", id_today);
  if(id_max > id_today){
    return {
      code: 0,
      data: result
    }
  }else{
    return {
      code: 3,
      data: result
    }
  }
  
}