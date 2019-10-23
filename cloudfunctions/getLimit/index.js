// 云函数入口文件
// 获取每一个id对应的点击限制：
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("event: ", event);
  let {
    id,
    userInfo
  } = event;

  console.log("id: ", id);
  id = parseInt(id);
  
  let result = null;
  let id_max = 0;
  try{
    const db = cloud.database();
    const collectMax = db.collection('maxValueSet');
    result = await collectMax.where({
      data: {
        id: id
      }
    }).get()
    // .then(res=>{
    //   console.log("res.data: ", res.data[0].data.max_value);
    //   id_max = res.data[0].data.max_value;
    // });
  } catch (e) {
    return {
      code: 1,
      msg: e.message
    };
  };

  // console.log("id_max: ", id_max);

  return {
    code: 0,
    data: result
  };
}