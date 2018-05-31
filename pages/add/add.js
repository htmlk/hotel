// pages/add/add.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var xiaok = require('../../utils/xiaok.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imginfo: {
      imgurl: {
        filename: 'avatar1494938751865.jpg'
      }
    },
    address:'',
    files: [],
    typearray: ['', '更多', '酒店', '旅馆', '公寓', '今日特惠', '整租', '合租', '民宿', '遇见青旅'],
    degreearray: ['','0','1', '2', '3', '4', '5', '6', '7', '8', '9'],
    typeindex: 0,
    degreeindex:0,
    isAgree: true
  },
   typebindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      typeindex: e.detail.value
    })
  },
  degreebindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      degreeindex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //定位地址
    var that=this
    var demo = new QQMapWX({
      key: 'MVEBZ-GXSWU-XX3VD-2JFAO-IA7NV-SXFAH' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        demo.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(res);
            that.setData({
              address:res.result.address
            })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      }
    })

    
 
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        var length = tempFilePaths.length; //总共个数
        var i = 0; //第几个
        var img = '';
        wx.showLoading({
          title: '图片上传中...',
        });
        that.uploadIMG(tempFilePaths, i, length, img);
     
      }
    })
  },
  formSubmit: function (e) {
    var obj = e.detail.value
    for (var key in obj) {
      if (!obj[key]){
        wx.showToast({
          title: '请完善商品',
          icon: 'fail',
          duration: 2000
        })
        return;
      };
    }
    console.log(obj)
    wx.showLoading({
      title: '正在发布中...',
    });
    var obj = e.detail.value
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //当前时间戳为：1403149534  
    console.log("当前时间戳为：" + timestamp);  
    obj.time = timestamp
    var login=wx.getStorageSync('login');
    obj.username = login.nickName
    obj.userimg=login.avatarUrl
    console.log(obj)
   wx.request({
     url: xiaok.ApiRootUrl +'/goodAdd',
     data:obj,
     method:'POST',
     success:function(res){
        console.log(res)
        wx.hideLoading()
        if(res.data.code==200){
          wx.showModal({
            title: '发布成功',
            content: '是否去上架商品',
            success: function (res) {
              
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/release/release',
                })
               
              } else if (res.cancel) {
                wx.navigateTo({
                  url: '/pages/index/index',
                })
              }
            }
          })
         
        }else{
          wx.showModal({
            title: '发布失败',
            content: '是否继续发布',
            success: function (res) {
              if (res.confirm) {

              } else if (res.cancel) {
                wx.navigateTo({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }
     }
   })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  // 上传多文件时递归的函数体体   
  uploadIMG(filePaths, i, length, img) {

    wx.uploadFile({
      url: xiaok.ApiRootUrl +'/profileArr',
      filePath: filePaths[i],
      name: 'avatar',
      success: (res) => {
        var resAll=JSON.parse(res.data)
        console.log(resAll, '多图回来');

        img += resAll.imgurl[0].filename;
        i++;
        if (i == length) {
          wx.hideLoading();
          this.setData({ goods_img: img })
        }
        else {  //递归调用函数
          img += ',';
          this.uploadIMG(filePaths, i, length, img);
        }
      },
      complete: (res) => {
       
      },
    });
 
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
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