// miniprogram/pages/list/list.js
let app = getApp();
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
    this.getData();
  },
  /**
   * 获取今日活动列表
   */
  getData() {
    var that = this;
    const db = wx.cloud.database();
    db.collection('2018202142')
    // .where({//查询数据库
    //   timestamp: db.command.gte(parseInt(new Date().setHours(0, 0, 0, 0)))
    // })
    .orderBy('timestamp', 'desc').get()
    .then(res=>{
      console.log("res: ", res);
      let data = res.data;
      data = data.map((item) =>{
        item.date = new Date(item.timestamp).toLocaleDateString('it-IT');
        item.timestamp = new Date(item.timestamp).toLocaleTimeString('it-IT');
        return item;
      });
      this.setData({
        list:data
      });
    }).catch(e=>{
      console.log(e);
      wx.showToast({
        title: 'db读取失败',
        icon: 'none'
      });
    });
  },

  /**
   * 跳转至编辑页面
   */
  getDetail(e) {
    console.log(e.mark.item);
    app.globalData.detail = e.mark.item;
    wx.navigateTo({
      url: '../detail/detail'
    });
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