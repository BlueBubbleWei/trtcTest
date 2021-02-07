// const baseUrl = 'https://fls-factoring-stg1.pingan.com.cn/wxma_sit2'
const baseUrl = 'https://fls-factoring-stg1.pingan.com.cn/wx/ma'
/**
 * 数据请求模块
 * 接口地址 http://daxun.kuboy.top/apidoc
 * 先显示加载框，然后请求结束加载框消失
 * 
 */
export function request (url, data, type="GET") {
  // 显示加载中
  // 参考https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showLoading.html
  // wx.showLoading({
  //   title: '加载中',
  // })
  // 使用promise 解决异步操作问题，此处还可以使用 async + await
  return new Promise((resolve, reject) => {
    // 微信小程序的数据请求方法
    // 必须配置小程序的安全域名，
    // 在开发阶段可以在“详情” - “本地设置” - 勾选中 不校验请求域名、web-view(业务域名)、TLS版本及HTTPS证书
    // const header = {"Content-Type": "application/json;charset=UTF-8"}
    // const header = { "accept": "*/*","content-type": "application/json" }
    wx.request({
      url: baseUrl + url,
      method: type,
      header: {
        "Accept": "application/json;charset=UTF-8" // 使用这个能正常获取数据
      },
      data: data || {},
      success: (res) => {
        if(res.data.code != 200) {
          // 隐藏加载中
          wx.hideLoading();
        }
        // 后续处理
        resolve(res.data)
      }
    })
  })
}

/**
 * 可消失的提示框 - 默认只显示文字
 * str 提示内容
 * icon 是否需要图标，none 、 success(默认值) 、 loading
 */
export function Toast (str, icon) {
  // 微信提供的API接口
  // 参照 https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html
  wx.showToast({
    title: str,
    icon: icon || 'none'
  })
}
