// pages/buyin/buyin.js
var xiaok = require('../../utils/xiaok.js');
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
    var that = this
    var login = wx.getStorageSync('login')
    var username = encodeURI(login.nickName)
    console.log(login.nickName)
    wx.request({
      url: xiaok.ApiRootUrl +'/goodorderbyname?username=' + username,
      method: 'GET',
      success: function (res) {
        console.log(res)
        //处理时间
      
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].timetext = getLocalTime(res.data[i].time)
        }
        that.setData({
          goodall: res.data
        })
      }
    })

    function getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");   
    
    }
  },
  detailtap: function (e) {
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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