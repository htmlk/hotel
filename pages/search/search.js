// pages/list/list.js
var xiaok = require('../../utils/xiaok.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: true,
    inputVal: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  showInput: function () {
    console.log(0)
    this.setData({
      inputShowed: true,
    });
  },
  hideInput: function (e) {
    
    var that=this
    console.log(that.data.inputVal)
    var val = encodeURI(that.data.inputVal)
    wx.request({
      url: xiaok.ApiRootUrl +'/searchgood?val=' + val,
      method: 'GET',
      success: function (res) {
        console.log(res)
        var imgarr = []
        for (var i = 0; i < res.data.length; i++) {
          //处理图片
          var imgurl = res.data[i].img.split(',')
          res.data[i].imgarr = imgurl
          //处理时间
          var nowTime = new Date();
          var endTime = new Date(res.data[i].time * 1000);

          var t = nowTime.getTime() - endTime.getTime();
          var d = Math.floor(t / 1000 / 60 / 60 / 24);
          var hour = Math.floor(t / 1000 / 60 / 60 % 24);
          var min = Math.floor(t / 1000 / 60 % 60);
          var sec = Math.floor(t / 1000 % 60);
          if (d == 0 && hour == 0 && min == 0) {
            var timetext = sec + '秒前发布'
          }
          if (d == 0 && hour == 0 && min != 0) {
            var timetext = min + '分钟前发布'
          }
          if (d == 0 && hour != 0) {
            var timetext = hour + '小时前发布'
          }
          if (d != 0) {
            var timetext = d + '天前发布'
          }
          res.data[i].timetext = timetext

        }
        
        that.setData({
          goodall: res.data,
          inputVal: "",
          inputShowed: false
        })
      }
    })
  },
  clearInput: function () {

    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var that=this
    console.log(e.detail.value)
    this.setData({
      inputVal: e.detail.value,
      goodall:""
    });
    var val = encodeURI(e.detail.value)
    wx.request({
      url: xiaok.ApiRootUrl +'/searchgood?val=' + val,
      method:'GET',
      success:function(res){
        console.log(res)
        that.setData({
          val:res.data
        })
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

  }
})