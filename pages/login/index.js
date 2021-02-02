// pages/login/index.js
import { request } from "../../utils/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
      phoneNumber: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 要传的参数 authentication phoneNo userType
    // 如果认证成功的话，就跳转页面
    if(options.authentication){
      this.setData({phoneNumber: options.phoneNo})
      this.switchPage(options.userType)
    }
    // wx.hideHomeButton()
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
  submit: function(){
    if(this.data.phoneNumber.length < 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }
    const params = {phoneNo: this.data.phoneNumber}
    request('/wxma/vedio/demo/login', params, 'POST').then(res => {
      console.log(res)
      const data = res.data
      this.switchPage(data.userType)
      // if(Number(data.userType) === 1) {
      //   // 跳转到信审
      //   wx.redirectTo({
      //     url: '/pages/login/supervisor/index?phoneNo=' + this.data.phoneNumber
      //   })
      // } else if (Number(data.userType) === 2) {
      //   // 跳转到企业客户
      //   wx.redirectTo({
      //     url: '/pages/login/interviewee/index?phoneNo=' + this.data.phoneNumber
      //   })
      // }
    })
  },
  /**
   * 跳转页面
   */
  switchPage(userType){
    if(Number(userType) === 1) {
      // 跳转到信审
      wx.redirectTo({
        url: '/pages/login/interviewee/index?phoneNo=' + this.data.phoneNumber
      })
    } else if (Number(userType) === 2) {
      // 跳转到企业客户
      wx.redirectTo({
        url: '/pages/login/supervisor/index?phoneNo=' + this.data.phoneNumber
      })
    }
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