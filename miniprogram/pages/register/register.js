//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    stuId: '',
    score: 0
  },

  /**
   * 注册用户
   */
  register: function (e) {
    const data = this.data;
    const formData = e.detail.value;

    if (!formData.name || !formData.stuId) {
      return wx.showToast({
        title: '姓名、学号不能为空',
        icon: 'none'
      });
    }
    wx.showLoading({
      title: '正在注册...',
    });

    //调用云函数--register
    wx.cloud.callFunction({
      name: 'register',
      data: {
        name: formData.name,
        stuId: formData.stuId,
        score: data.score
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
      //跳转到首页
      //stuId作爲向對應數據庫中插入的標識
      app.globalData.stuId = formData.stuId;
      app.globalData.score = this.data.score;
      app.globalData.name = formData.name;

      console.log("app.globalData.stuId", app.globalData.stuId);
      console.log("app.globalData.score", app.globalData.score);
      console.log("app.globalData.name", app.globalData.name);
      
      wx.redirectTo({
        url: '../index/index',
      });
      wx.hideLoading();
    }).catch(err => {//调用云函数失败
      console.log('调用失败--register', err);
      wx.hideLoading();
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})