// /pages/release/release.js
var xiaok = require('../../utils/xiaok.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var login=wx.getStorageSync('login')
    var username = encodeURI(login.nickName)
    console.log(login.nickName)
    wx.request({
      url: xiaok.ApiRootUrl +'/goodByname?username=' + username ,
      method:'GET',
      success:function(res){
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
          goodall:res.data
        })
      }
    })
  },
  /**
   * 上下架
   */
  switch1Change: function (e) {
    var that=this
    console.log( e)
    if(e.detail.value){
      var online=1
    }else{
      var online=0
    }
    that.setData({
      id:id
    })
    var id = e.target.dataset.id
    wx.request({
      url: xiaok.ApiRootUrl +'/goodupdateonlie?online='+online+'&id='+id,
      method:'GET',
      success:function(res){
        console.log(res)
      }

    })
    console.log(id)
  },
  delgood:function(e){
    var that=this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '淘弃提示',
      content: '是否删除当前商品',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: xiaok.ApiRootUrl +'/gooddelete?id=' + id,
            method: 'GET',
            success: function (res) {
              console.log(res)
              if (res.data.code==200){
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                that.onLoad()
              }else{
                wx.showToast({
                  title: '删除失败',
                  icon: 'fail',
                  duration: 1000
                })
              }
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  
  },
  /**
 * 跳转详情页
 */
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
    this.onLoad()
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