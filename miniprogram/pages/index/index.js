// miniprogram/pages/index/index.html.js

let app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[0,0,0,0,0,0,0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onGetOpenid();
  },

  onGetOpenid() {
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
    // console.log(openid);
    // console.log(typeof (openid));
    //初始化用户信息
    var that = this;
    db.collection('user')
      .where({
        _openId: openid //填入用户当前openId
      }).get({
        success: function (res) {
          // console.log(res.data);
          if (res.data.length > 0) {
            console.log("用户已存在");
            console.log("res: ", res);
            //获取用户的stuId
            app.globalData.stuId = res.data[0].stuId;
            app.globalData.score = res.data[0].score;
            app.globalData.name = res.data[0].name;
            that.setData({
              name:app.globalData.name,
              grade:app.globalData.score
            });
            that.getStuToday(res.data[0].stuId);
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
  getStuToday(stuId){
    var that = this;
    console.log(stuId);
    wx.cloud.callFunction({
      name: 'getStuToday',
      data: {
        stuId:stuId
      },
      success: res => {
        console.log("getStuToday=>res: ", res.result.data.list);
        res.result.data.list.forEach(function (element) {
          let temp = "array[" + (parseInt(element._id) - 1) +"]";
          that.setData({
            [temp]: element.num
          });
        });
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
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

  },

  clickTap(event) {

    var that = this;


    //插入到數據庫--參數 event：{id: , value: , time: lat, lng, }
    var timestamp = Date.parse(new Date());
    // timestamp = 1000;
    console.log("当前时间戳为：" + timestamp);
    console.log(event.mark);
    console.log(event.mark.id, event.mark.name, timestamp)
    console.log("app.globalData.stuId: ", app.globalData.stuId);
    const id = event.mark.id;
    const activity = event.mark.name;
    //今天对应的id点击次数自增
    let temp = "array[" + (id - 1) + "]";
    that.setData({
      [temp]: this.data.array[id-1]+1
    });

    //获取句子
    wx.cloud.callFunction({
      name: 'getSentence',
      data: {
        id: id
      },
      success: res => {
        console.log("调用成功， res is: ", res);
        let sen = res.result.data.data[0].sentence;
        wx.showToast({
          title: sen,
          icon: "none",
          duration: 3000
        });
        //TODO添加记录
        this.addRecord(event);
      },
      fail: res => {
        console.log("调用失败，res is: ", res);
      }
    });
  },

  addRecord(event) {
    //插入到數據庫--參數 event：{id: , value: , time: lat, lng, }
    var timestamp = Date.parse(new Date());
    // timestamp = 1000;
    console.log("当前时间戳为：" + timestamp);
    console.log(event.mark);
    console.log(event.mark.id, event.mark.name, timestamp)
    console.log("app.globalData.stuId: ", app.globalData.stuId);
    const id = event.mark.id;
    const activity = event.mark.name;

    //调用云函数--添加记录
    wx.cloud.callFunction({
      name: 'addActivity',
      data: {
        id: id,
        activity: activity,
        timestamp: timestamp,
        stuId: app.globalData.stuId
      }
    }).then(res => {//res is returned from cloud
      console.log('addActivity调用成功 and res is:', res);
      const result = res.result;
      const data = result.data || {}; //data为空

      if (result.code) {//code 非0, 表明出现错误
        console.log('something wrong');
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
        return;
      } else {
        //TODO判断是否加分
        this.addGrade(id);
      }
      // wx.hideLoading();
    }).catch(err => {//调用云函数失败
      console.log('调用失败', err);
      this.setData({
        statusMsg: '调用失败: ${err.errMsg}'
      });
      // wx.hideLoading();
    });
  },
  addGrade(id) {
    //调用云函数--获取该id对应的max_value
    let id_max = 0;
    wx.cloud.callFunction({
      name: 'getLimit',
      data: {
        id: id
      }
    }).then(res => {//res is returned from cloud
      console.log('getLimit-调用成功 and res is:', res);
      const result = res.result;
      const data = result.data || {}; //data为空
      id_max = data.data[0].data.max_value;
      console.log("id_max", id_max);

      if (result.code) {//code 非0, 表明出现错误
        console.log('getLimit-something wrong');
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
        return;
      }else{

        //get id_today
        //调用云函数，获取该id今日点击次数
        let today = new Date().setHours(0, 0, 0, 0);
        console.log("today: ", today);
        let id_today = 0;
        wx.cloud.callFunction({
          name: 'getToday',
          data: {
            id: id,
            stuId: app.globalData.stuId
          }
        }).then(res => {//res is returned from cloud
          console.log('getToday-调用成功 and res is:', res);
          const result = res.result;
          // const data = result.data || {}; //data为空
          id_today = result.data.total;
          console.log("id_today: ", id_today);
          if (result.code) {//code 非0, 表明出现错误
            console.log('getToday-something wrong');
            wx.showToast({
              title: result.msg,
              icon: 'none'
            });
            return;
          }else{
            var that = this;
            //判断是否添加score
            if (id_max >= id_today) {
              console.log("增加分数score");

              wx.cloud.callFunction({
                name: 'addScore',
                data: {
                  stuId: app.globalData.stuId
                }
              }).then(res => {//res is returned from cloud
                console.log('addscore-调用成功 and res is:', res);
                const result = res.result;
                const data = result.data || {}; //data为空
                app.globalData.score += 1;
                that.setData({
                  grade: app.globalData.score
                });
                if (result.code) {//code 非0, 表明出现错误
                  console.log('addscore-something wrong');
                  wx.showToast({
                    title: result.msg,
                    icon: 'none'
                  });
                  return;
                }
                // wx.hideLoading();
              }).catch(err => {//调用云函数失败
                console.log('addscore-调用失败', err);
                this.setData({
                  statusMsg: 'addscore-调用失败: ${err.errMsg}'
                });
                // wx.hideLoading();
              });
            } else {
              console.log("已超限，不加分");
            }
          }
          
          // wx.hideLoading();
        }).catch(err => {//调用云函数失败
          console.log('getToday-调用失败', err);
          this.setData({
            statusMsg: 'getToday-调用失败: ${err.errMsg}'
          });
          // wx.hideLoading();
        });
      }
      // wx.hideLoading();
    }).catch(err => {//调用云函数失败
      console.log('getLimit-调用失败', err);
      this.setData({
        statusMsg: 'getLimit-调用失败: ${err.errMsg}'
      });
      // wx.hideLoading();
    });
  }

})