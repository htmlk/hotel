// pages/detail/detail.js
var MD5=require('../../utils/md5.js')
var xiaok = require('../../utils/xiaok.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailinfo:[],
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  copywechat:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.setClipboardData({
      data: e.currentTarget.dataset.id,
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '微信号复制成功',
        })
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(MD5)
    var that=this

    wx.request({
      url: xiaok.ApiRootUrl +'/goodById?id=' + options.id,
      method:'GET',
      success:function(res){
        console.log(res)
       
        for (var i = 0; i < res.data.length; i++) {

          var imgurl = res.data[i].img.split(',')
         
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
          imgUrls: imgurl,
          detailinfo: res.data[0]
        })
       
      }
    })
  },
  //直接打电话
  callphone:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.id 
    })
  },
  showimg:function(e){
    var that=this
    var arr=[]
    arr.push(e.currentTarget.dataset.url)
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: arr, // 需要预览的图片http链接列表
      success:function(res){
        console.log(res)
      },fail:function(res){
        console.log(res)
      }
    })
  },
  order:function(){
    var that=this
    var data = this.data.detailinfo
    var opendata=wx.getStorageSync('openid');
    var login=wx.getStorageSync('login')
    var myDate = new Date();
    var year = myDate.getFullYear()
    var month = myDate.getMonth() + 1
    var day = myDate.getDate()
    var num=Math.floor(Math.random () * 900) + 100;;

    if(month<10){
      month='0'+month
    }
    if(day<10){
      day='0'+day
    }
    var out_trade_no = 'tq' + num + year + month + day + data.id
//当前时间戳为：1403149534  
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    
    console.log("当前时间戳为：" + timestamp);


    console.log(out_trade_no)
    wx.request({
      url: xiaok.ApiRootUrl +'/order',
      method:'post',
      data: {
        "body": data.title,
        "openid": opendata.openid,
        "out_trade_no": out_trade_no,
        "total_fee": data.price*100
      },
      success:function(res){
        console.log(res)
        if(res.data.code==200){
       
          wx.showModal({
            title: '你购买了以下商品是否立即付款',
            content: data.title,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.request({
                  url: xiaok.ApiRootUrl +'/pay',
                  method:'POST',
                  data: {
                    "openid": opendata.openid,
                    "out_trade_no": out_trade_no
                  },success:function(res){
                      console.log(res)
                      var username = login.nickName
                      var sellname = data.username
                      var order_id = out_trade_no
                      var good_id=data.id
                      that.pay(res, username, good_id, sellname,order_id,timestamp)
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },

  pay: function (e, username, good_id, sellname, order_id, imestamp){
    console.log(e)
    console.log(e.data.xml.prepay_id[0])
    var timestamp1 = Date.parse(new Date());
    var timestamp = (timestamp1 / 1000).toString();
    console.log(typeof timestamp)
    var nonceStr = '4Sl7dVNvky9jjzSiuJ5NHVa4VjaXWk60'
    var prepay_str = 'prepay_id=' + e.data.xml.prepay_id[0]
    var stringA = 'appId=wx73519dac730f22c4&nonceStr=' + nonceStr + '&package=' + prepay_str + '&signType=MD5&timeStamp=' + timestamp;
    var stringSignTemp = stringA + '&key=4Sl7dVNvky9jjzSiuJ5NHVa4VjaXWk60';
    console.log(stringSignTemp)
    var sign = MD5.MD5(stringSignTemp).toUpperCase()
    console.log(sign)
    wx.requestPayment({
      nonceStr: nonceStr,
      package: prepay_str,
      signType: 'MD5',
      timeStamp: timestamp,
      paySign: sign,
      'success': function (res) {
        console.log(res)
        wx.request({
          url: xiaok.ApiRootUrl +'/payorder',
          method: 'POST',
          data: {
            "username": username,
            "sellname": sellname,
            "good_id": good_id,
            "Business": 1,
            "pay_state": 1,
            "order_id": order_id,
            "time": timestamp
          },
          success: function (res) {
            console.log(res)
          }
        })
      },
      'fail': function (res) {
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