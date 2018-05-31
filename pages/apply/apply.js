// pages/apply/apply.js
var xiaok = require('../../utils/xiaok.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: '支付宝', value: '0' },
      { name: '微信', value: '1', checked: true }
    ],
    isAgree: true,
    applytype:'wechat',
    price:0
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    if (e.detail.value==0){
      var applytype='alipay'
    }else{
      var applytype = 'wechat'
    }
    this.setData({
      applytype: applytype,
      radioItems: radioItems
    });
  },
  formSubmit: function (e) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var arr = e.detail.value
    arr.time = timestamp
    arr.paystate=0
    arr.username = wx.getStorageSync('login').nickName
    arr.paytype = this.data.applytype
    console.log(arr)
    wx.request({
      url: 'https://www.htmlk.cn/applypay',
      method:'POST',
      data:arr,
      success:function(res){
        console.log(res)
        if(res.data.code==200){
          wx.showModal({
            title: '你的提现申请已经提交',
            content: '我们将会在1-3个工作内与你联系，并提现到你指定的账号,带来不便，敬请谅解！',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 2
                })
              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      price: options.id
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