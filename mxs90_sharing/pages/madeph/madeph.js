// pages/madeph/madeph.js
const app = getApp();

//js的这部分有很多是找的轮子，谢谢分享轮子的网友
/**
 * 大概两部分：
 * 1、先把用户上传的头像画出来，类一个圆
 * 2、把前一个页面传过来的头像框（中间透明）在画上去就基本结束了
 * PS：思路比较清晰，但细节完善的不是很好，只能说能用吧。
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    bgsrc: '',
    bgcss:''
  },

  //选择用户自己头像图片
  upload() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //将选择的图传至upload页处理
        wx.navigateTo({
          url: `../upload/upload?src=${src}`
        })
      }
    })
  },

  //生成头像，即先画图像再画图像框
  generate() {
    var self = this;
    var contex = wx.createCanvasContext('ahaucanvas'); //ttcanvas为该canvas的ID
    //var contex = ctx.getContext('2d');
    var avatarurl_width = 840; //这个是画布宽
    var avatarurl_heigth = 840; //这个是高
    // var avatarurl_x = 50;
    // var avatarurl_y = 50;
    // contex.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);//这个地方我画了个头像的圆
    // contex.clip();
    contex.drawImage(self.data.src, 127, 120);
    contex.restore();
    contex.save();
    contex.beginPath(); //开始绘制
    // contex.arc(150, 50, 30, 0, Math.PI * 2, false);
    // contex.clip();
    //contex.arc(25, 25, 25, Math.PI * 2, false);
    //contex.clip();
    contex.drawImage(self.data.bgsrc, 0, 0, avatarurl_width, avatarurl_heigth); // 这个是我的背
    contex.restore();
    // contex.setFontSize(20)
    // contex.fillStyle = "#fff";
    // contex.fillText(self.data.gameConfig.myScore, 130, 132)
    // contex.restore();
    contex.draw(true, setTimeout(function() {
      wx.canvasToTempFilePath({ //导出图片
        width: 840,
        height: 840,
        destWidth: 840,
        destHeight: 840,
        canvasId: 'ahaucanvas',
        success: res => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(data) {
            // console.log(data);
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail: function(err) {
              // console.log(err);
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                // console.log("用户一开始拒绝了，我想再次发起授权")
                // console.log('打开设置窗口')
                wx.openSetting({
                  success(settingdata) {
                    console.log(settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      // console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                      wx.showToast({
                        title: '请再次保存',
                        icon: 'success',
                        duration: 2000
                      })
                    } else {
                      // console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                      wx.showToast({
                        title: '获取权限失败，可能导致保存图片无法正常使用',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }, this)
    }, 100))
  },
  onLoad(option) {
    var that = this;
    var bgcss = app.globalData.toubgsrc.substr(14, 2);
    that.setData({
      bgsrc: app.globalData.toubgsrc,
      bgcss:bgcss
    });
    // console.log(that.data.bgsrc);
    // console.log(that.data.bgcss);
    let { avatar } = option;
    if (avatar) {
      that.setData({
        src: avatar
      });
    }
  }
})