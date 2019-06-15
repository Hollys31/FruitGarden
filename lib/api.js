const api = {
  getWXUserInfo:'/getWXUserInfo',
  getOpenid:'getOpenid',//获取openId
  postCheck: '/check',//扫码验证 

  report:'report',//检测报告
  
  homeInfo:'home/',//首页主要信息
  originFlow:'process/',//溯源流程

  orchard: 'gardenDetail',//果园信息
  
  origin:'orisech',//溯源信息
  saveFeedback:'/origin/fedback',//异常反馈

  feedBackList:'origin/fedbackList',//异常反馈列表

  farmWorkList:'farmWorkList',//农事记录列表
  farmProduct:'productInfo',//农事信息产品信息

  pano:'em',//全景
  live:'liveList',//直播
  smallVideo:'smallVideo',//小视频

  environment:'environment',//环境
}
module.exports = api;