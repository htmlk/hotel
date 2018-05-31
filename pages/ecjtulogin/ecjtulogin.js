// pages/ecjtulogin/ecjtulogin.js
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
    var that = this;
    try {
      var value = wx.getStorageSync('login')
      var open = wx.getStorageSync('openid')
      if (!value || !open) {
        wx.login({
          success: function (res) {
            console.log(res)
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://www.htmlk.cn/openid?code=' + res.code,
                success: function (e) {
                  console.log(e)
                  var edata = JSON.parse(e.data)
                  console.log(edata)
                  wx.setStorageSync('openid', edata)
                  wx.getUserInfo({
                    success: function (res) {
                      console.log(res)
                      wx.setStorageSync('login', res.userInfo)
                      var timestamp = Date.parse(new Date());
                      timestamp = timestamp / 1000;

                      var str = JSON.stringify(res.userInfo)
                      wx.request({
                        url: 'https://www.htmlk.cn/addlogin',
                        method: 'POST',
                        data: {
                          userinfo: str,
                          time: timestamp,
                          openid: edata.openid
                        },
                        success: function (res) {
                          console.log(res)
                        }
                      })
                    }
                  })
                }
              })

            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }, fail: function (e) {
            console.log(e)
          }
        });
      }
    } catch (e) {
      console.log(e)
    }

  },
  formSubmit:function(e){
    
    var obj=e.detail.value
   obj.wechatname = wx.getStorageSync('login').nickName
   obj.openid = wx.getStorageSync('openid').openid
   obj.time= Date.parse(new Date()) / 1000;
   
    console.log(obj)
    wx.request({
      url: 'https://www.htmlk.cn/ecjtu/ecjtulogin',
      method:'POST',
      data: obj,
      success:function(res){
        console.log(res)
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