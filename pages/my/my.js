// pages/my/my.js
var xiaok = require('../../utils/xiaok.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mylist: [
      {
        id:1,
        listname: '我发布的',
        img: '/images/myicon/fabu.png'
      }, {
        id: 2,
        listname: '我卖出的',
        img: '/images/myicon/maichu.png'
      }, {
        id: 3,
        listname: '我买到的',
        img: '/images/myicon/maidao.png'
      }, {
        id: 4,
        listname: '我要推荐',
        img: '/images/myicon/xihuan.png'
      }
    ]
  },
 yijian:function(){
   wx.showModal({
     title: '是否给意见客服拨打电话！',
     content: '客服电话：18679654648',
     success: function (res) {
       if (res.confirm) {
         wx.makePhoneCall({
           phoneNumber: '18679654648' //仅为示例，并非真实的电话号码
         })
       } else if (res.cancel) {

       }
     }
   })
  
 },
 kefu:function(){
   wx.showModal({
     title: '是否给客服拨打电话！',
     content: '客服电话：18679654648',
     success: function (res) {
       if (res.confirm) {
         wx.makePhoneCall({
           phoneNumber: '18679654648' //仅为示例，并非真实的电话号码
         })
       } else if (res.cancel) {

       }
     }
   })
 },
  quit:function(){
    var that=this
    try {
      wx.clearStorageSync()
      that.setData({
        userinfo: []
      })
    } catch (e) {
      // Do something when catch error
    }
    
  },
  checklogin:function(){

    var that = this;
    try {
      var value = wx.getStorageSync('login')
      console.log(!value)
      if (!value) {
        wx.showModal({
          title: '淘弃温馨提示！',
          content: '你未授权登录,发布、买卖功能将关闭。如需使用请在小程序列表中删除该程序，重新进入授权，感谢您的使用！',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            } else if (res.cancel) {

            }
          }
        })
      }else{
       

      }
       
      
    } catch (e) {
      console.log(e)
    }
  },
  listtap:function(e){
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    if(id==1){
      wx.navigateTo({
        url: '/pages/release/release',
      })
    }
    if (id == 2) {
      wx.navigateTo({
        url: '/pages/sellout/sellout',
      })
    }
    if (id == 3) {
      wx.navigateTo({
        url: '/pages/buyin/buyin',
      })
    }
   
  },
  error:function(){
    wx.showModal({
      title: '很抱歉此功能未开放',
      content: '有问题请联系客服微信：k1009756987',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getStorage({
      key: 'login',
      success: function(res) {
        console.log(res.data)
        that.setData({
          userinfo:res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.checklogin()
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