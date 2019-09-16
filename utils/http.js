/* var api_base_url = "http://192.168.2.169:7070/api/applet/v1/";  */
/* var api_base_url = "http://192.168.2.118:7070/api/applet/v1/"; */
/* var api_base_url = "https://testorchdbs.yufengtek.com/orchard/applet/api/"; */
  var api_base_url = "https://trace.yufengtek.com/orchard/applet/api/";  
var api = require('./api.js');
function POST(params,errback) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: api_base_url + api[params.url],
      data: params.data,
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        if (res.data.status == 200 || errback) {
          resolve(res.data);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '请求出错',
          icon: 'none',
          duration: 2000
        })
        reject();
      },
      complete: function () {
        /* that.setData({
          loading: false
        }) */
      }
    })
  })
  return promise;
}
function GET(params) {
  const promise = new Promise(function (resolve, reject) {
    let url = api_base_url + api[params.url]
    for (const item in params.data) {
      url = url + '/' + params.data[item];
    }
    wx.request({
      url: url,
      method:'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        if (res.data.status == 200) {
           resolve(res.data);
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '请求出错',
          icon: 'none',
          duration: 2000
        })
        reject({ error: '网络错误', code: 0 });
      },
      complete: function () {
        /* that.setData({
          loading: false
        }) */
      }
    })
  })
  return promise
}

module.exports ={
  POST,
  GET
};