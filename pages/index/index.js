// pages/index/index.js
var xiaok = require('../../utils/xiaok.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: true,
    inputVal: "",
    listArr:[
      {
        listname:'酒店',
        img:'/images/icon/computer.png'
      }, {
        listname: '旅馆',
        img: '/images/icon/notebook.png'
      }, {
        listname: '公寓',
        img: '/images/icon/headphone.png'
      }, {
        listname: '今日特惠',
        img: '/images/icon/pencil.png'
      }, {
        listname: '整租',
        img: '/images/icon/shop.png'
      }, {
        listname: '合租',
        img: '/images/icon/girl.png'
      }, {
        listname: '民宿',
        img: '/images/icon/chat.png'
      }, {
        listname: '遇见青旅',
        img: '/images/icon/folder.png'
      }
    ],
    goodall:[]
  },
  listtap:function(e){
    console.log(e.currentTarget.dataset.type)
    wx.navigateTo({
      url: '/pages/list/list?type=' + e.currentTarget.dataset.type,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    /**
     * 请求数据
     */
    that.alldata()
  },
  alldata:function(){
    wx.showLoading({
      title: '正在加载...',
    })
    var that=this
    wx.request({
      url: xiaok.ApiRootUrl+'/goodAll',
      method: 'GET',
      success: function (res) {
        console.log(res)
        wx.hideLoading()
      
        var imgarr=[]
        for(var i=0;i<res.data.length;i++){
            //处理图片
          var imgurl=res.data[i].img.split(',')
          res.data[i].imgarr =imgurl
            //处理时间
          var nowTime = new Date();
          var endTime = new Date(res.data[i].time * 1000);

          var t = nowTime.getTime()-endTime.getTime();
          var d=Math.floor(t/1000/60/60/24);
          var hour = Math.floor(t / 1000 / 60 / 60 % 24);
          var min = Math.floor(t / 1000 / 60 % 60);
          var sec = Math.floor(t / 1000 % 60);
          if(d==0&&hour==0&&min==0){
            var timetext = sec+ '秒前发布'
          }
          if (d == 0 && hour == 0 && min != 0) {
            var timetext = min + '分钟前发布'
          }
          if (d == 0 && hour != 0 ) {
            var timetext = hour + '小时前发布'
          }
          if (d != 0 ) {
            var timetext = d + '天前发布'
          }
          res.data[i].timetext = timetext

        }
        //处理时间
       
        console.log(res.data)
        that.setData({
          goodall: res.data
        })

      

      }
    })
  },
  /**
   * 进入搜索
   */
  inputShowed:function(){
    wx.navigateTo({
      url: '/pages/search/search',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 进入我的页面
   */
  hideInput:function(){
    wx.navigateTo({
      url: '/pages/my/my',
    })
  },
  /**
   * 进入添加页面
   */
  addpage:function(){
    wx.navigateTo({
      url: '/pages/add/add',
    })
  },
  /**
   * 跳转详情页
   */
  detailtap:function(e){
    console.log(e.currentTarget.dataset.id)
   var  id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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
                url: xiaok.ApiRootUrl +'/openid?code=' + res.code,
                success: function (e) {
                  console.log(e)
                  var edata=JSON.parse(e.data)
                  console.log(edata)
                  wx.setStorageSync('                                                ', edata)
                  wx.getUserInfo({
                    success: function (res) {
                      console.log(res)
                      wx.setStorageSync('login', res.userInfo)
                      var timestamp = Date.parse(new Date());
                      timestamp = timestamp / 1000;

                      var str = JSON.stringify(res.userInfo)
                      wx.request({
                        url: xiaok.ApiRootUrl +'/addlogin',
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
    this.alldata()
    wx.getSetting({
      success(res) {
        if (!res['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
             
            }
          })
        }
      }
    })
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