// pages/login/interviewee/index.js
import { request } from "../../../utils/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    connectList: [{
      id: 123,
      name: 'Emily',
      applicantJobTitle: '总监',
      phoneNo: 13255538611
    },{
      id: 123,
      name: 'John',
      applicantJobTitle: '经理',
      phoneNo: 13255538612
    }],
    phoneNo: '',
    userType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('>>>>>>>>', options)
    this.setData({
      phoneNo: options.phoneNo,
      userType: options.userType
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
    if(wx.canIUse('hideHomeButton')){
      wx.hideHomeButton()
    }
    this.getData()
  },
  getData() {
    const params = {
                    phoneNo: this.data.phoneNo,
                    userType: this.data.userType
                  }
    request('/wxma/vedio/demo/interview/list', params, 'POST').then(res => {
      console.log('列表数据', res)
      res.data.map((item) => {
        switch(item.applicantJobTitle){
          case "1":
            item.applicantJobTitle = '法定代表人'
            break
          case "2":
            item.applicantJobTitle = '实控人'
            break
        }
        return item
      })
      
      this.setData({connectList: res.data})
    })
  },
  goRoom(e){
    console.log('进入房间', e)
    const info = e.target.dataset.info
    const params = {code: 123} 
    this.enterRoom(params.code, info)

    // wx.navigateTo({
    //   url: '/pages/index/index'
    // })
  },
  enterRoom: function(roomID, userInfo) {
    const nowTime = new Date()
    if (nowTime - this.tapTime < 1000) {
      return
    }
    if (!roomID) {
      wx.showToast({
        title: '请输入房间号',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    if (/^\d*$/.test(roomID) === false) {
      wx.showToast({
        title: '房间号只能为数字',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    if (roomID > 4294967295 || roomID < 1) {
      wx.showToast({
        title: '房间号取值范围为 1~4294967295',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    const url = `../../room/room?roomID=${roomID}&template=1v1&debugMode=false&cloudenv=PRO&&userInfo=${JSON.stringify({id: userInfo.id, type: 'supervisor'})}`
    console.log('跳转的url', url)
    this.tapTime = nowTime
    this.checkDeviceAuthorize().then((result)=>{
      console.log('授权成功', result)
      // 调用改变状态的接口
      this.changeStatus(userInfo)
      wx.navigateTo({ url: url })
    }).catch((error)=>{
      console.log('没有授权', error)
    })
  },
  checkDeviceAuthorize: function() {
    this.hasOpenDeviceAuthorizeModal = false
    return new Promise((resolve, reject) => {
      if (!wx.getSetting || !wx.getSetting()) {
        // 微信测试版 获取授权API异常，目前只能即使没授权也可以通过
        resolve()
      }
      wx.getSetting().then((result)=> {
        console.log('getSetting', result)
        this.authorizeMic = result.authSetting['scope.record']
        this.authorizeCamera = result.authSetting['scope.camera']
        if (result.authSetting['scope.camera'] && result.authSetting['scope.record']) {
          // 授权成功
          resolve()
        } else {
          // 没有授权，弹出授权窗口
          // 注意： wx.authorize 只有首次调用会弹框，之后调用只返回结果，如果没有授权需要自行弹框提示处理
          console.log('getSetting 没有授权，弹出授权窗口', result)
          wx.authorize({
            scope: 'scope.record',
          }).then((res)=>{
            console.log('authorize mic', res)
            this.authorizeMic = true
            if (this.authorizeCamera) {
              resolve()
            }
          }).catch((error)=>{
            console.log('authorize mic error', error)
            this.authorizeMic = false
          })
          wx.authorize({
            scope: 'scope.camera',
          }).then((res)=>{
            console.log('authorize camera', res)
            this.authorizeCamera = true
            if (this.authorizeMic) {
              resolve()
            } else {
              this.openConfirm()
              reject(new Error('authorize fail'))
            }
          }).catch((error)=>{
            console.log('authorize camera error', error)
            this.authorizeCamera = false
            this.openConfirm()
            reject(new Error('authorize fail'))
          })
        }
      })
    })
  },
  openConfirm: function() {
    if (this.hasOpenDeviceAuthorizeModal) {
      return
    }
    this.hasOpenDeviceAuthorizeModal = true
    return wx.showModal({
      content: '您没有打开麦克风和摄像头的权限，是否去设置打开？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res)=>{
        this.hasOpenDeviceAuthorizeModal = false
        console.log(res)
        // 点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { },
          })
        } else {
          console.log('用户点击取消')
        }
      },
    })
  },
  // 向后台传递用户的状态
  changeStatus(info) {
    const params = {id: info.id, status: 1}
    request('/wxma/vedio/demo/face/trial/status', params, 'POST').then(res => {
      console.log('用户的状态', res)
    })
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