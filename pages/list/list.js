var app = getApp()
var xiaok = require('../../utils/xiaok.js');
Page({
  data: {
    current: 0,
    listgoods: [],
    swiper: {
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000
    }
  },
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that=this
    var listtype = encodeURI(options.type)
    wx.request({
      url: xiaok.ApiRootUrl +'/goodBytype?type=' + listtype,
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
  switchSlider: function (e) {
    this.setData({
      current: e.target.dataset.index
    })
  },
  changeSlider: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }

})
