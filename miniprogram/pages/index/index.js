// miniprogram/pages/index/index.html.js

let app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onGetOpenid();
  },

  onGetOpenid () {
    // 调用云函数

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.onInit(res.result.openid);
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    });
  },

  onInit(openid) {
    console.log(openid);
    console.log(typeof (openid));
    //初始化用户信息
    db.collection('user')
      .where({
      _openId: openid //填入用户当前openId
    }).get({
        success: function (res) {
        console.log(res.data);
        if (res.data.length > 0) {
          console.log("用户已存在");
          console.log("res: ", res);
          //获取用户的stuId
          app.globalData.stuId = res.data[0].stuId;
          app.globalData.score = res.data[0].score;
          app.globalData.name = res.data[0].name;

          console.log("app.globalData.stuId", app.globalData.stuId);
          console.log("app.globalData.score", app.globalData.score);
          console.log("app.globalData.name", app.globalData.name);
          
        } else {
          console.log('用户不存在，请先注册')
          wx.redirectTo({
            url: '../register/register',
          });
        }
      },
      err: function (e) {
        console.error('初始话用户信息失败', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  clickTap(event){
    //插入到數據庫--參數 event：{id: , value: , time: lat, lng, }
    var timestamp = Date.parse(new Date());
    timestamp /= 1000;
    console.log("当前时间戳为：" + timestamp);
    console.log(event.mark);
    console.log(event.mark.id, event.mark.name, timestamp)
    console.log("app.globalData.stuId: ", app.globalData.stuId);
    const id = event.mark.id;
    const activity = event.mark.name;

    wx.showLoading({
      title: '上传中...',
    });

    //调用云函数
    wx.cloud.callFunction({
      name: 'addActivity',
      data: {
        id: id,
        activity: activity,
        timestamp: timestamp,
        stuId: app.globalData.stuId
      }
    }).then(res => {//res is returned from cloud
      console.log('调用成功 and res is:', res);
      const result = res.result;
      const data = result.data || {}; //data为空

      if (result.code) {//code 非0, 表明出现错误
        console.log('something wrong');
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
        return;
      }

      wx.hideLoading();
    }).catch(err => {//调用云函数失败
      console.log('调用失败', err);
      this.setData({
        statusMsg: '调用失败: ${err.errMsg}'
      });
      wx.hideLoading();
    });

  }
  
})