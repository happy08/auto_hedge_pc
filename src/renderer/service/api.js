/**
 * 1、接口数据，服务器同步和获取数据
 * 2、本地接口，使用model统一管理
 */

import { get, post, postJSON, http } from './http';
export const regAct = p => post('v1/Reg/regAct',p);  // 註冊
export const sendSms = p => post('v1/Login/sendSms',p);  // * type 类型 1 注册 2 找回登陆密码 3 交易密码 4 账号转账（登录）
export const sendEmail = p => post('v1/Login/sendEmail',p);  // * 1表示 注册 2表示其他
export const loginact = p => post('v1/login/loginact',p);  // 登陆
export const emailLogin = p => post('v1/login/emailLogin',p);  // 邮箱登陆

// export const loginout = p => post('v1/login/loginout',p);  // 登出
export const resetPassword = p => post('v1/login/resetPassword',p);  // 手机重置登陆密码
export const setNewPass = p => post('v1/login/setNewPass',p)  //邮箱重置密码
export const getAuthInfo = p => post('v1/Trade/getAuthInfo',p);  // 权限商品信息获取
export const getFriend = p => post('v1/user/getFriend',p);  // 我的好友 直推好友
export const uploadSelfIdentity = p => post('v1/user/uploadSelfIdentity',p)  //身份证信息上传
export const getInviteCode = p => post('v1/user/getInviteCode',p)  //身份证信息上传
// zb 行情
// ?market=eth_usdt
export const zbTrade = p => get('http://api.zb.live/data/v1/ticker',{market:p},false,1)  
// gateio 行情
// eth_usdt
export const gateioTrade = p => get(`https://data.gateio.life/api2/1/ticker/${p}`,p,false,2)  
export const okexTrade = p => get(`https://www.okex.me/api/spot/v3/instruments/${p}/ticker`,p,false,3)  
// 我的个人信息
export const getUserInfo = p => post('v1/user/info',p)  
export const getTraderLog = p => post('v1/user/getTraderLog',p)  //我的佣金 交易流水
export const getMentionMoneyLog = p => post('v1/user/getMentionMoneyLog',p)  //提币记录
export const addMentionMoneyLog = p => post('v1/user/addMentionMoneyLog',p)  //提币申请
export const addrAction = p => post('v1/user/addrAction',p)  //添加提币地址
export const getAddrAction = p => post('v1/user/getAddrAction',p)  //添加提币地址
// 排名
export const getUserRank = p => post('v1/Reg/getUserRank',p)  
// 市场消息
export const uploadTradeMsg = p => post('v1/Trade/uploadTradeMsg',p)  
// 订单记录
export const uploadTradeOrder = p => post('v1/Trade/uploadTradeOrder',p)  
// 转账信息
export const transferInfo = p => post('v1/Trade/transferInfo',p)  
// 订单详情
export const orderInfo = p => post('v1/Trade/orderInfo',p)  
// 凭证上传
export const orderPay = p => post('v1/Trade/orderPay',p)  
// 取消订单
export const cancelOrder = p => post('v1/Trade/cancelOrder',p)  
//我的订单
export const orderList = p => post('v1/Trade/orderList',p)  
//下單
export const confirmOrder = p => post('v1/Trade/confirmOrder',p)  
//退出
export const loginout = p => post('v1/Login/loginout',p)  
//实名信息
export const getUploadSelfIdentity = p => post('v1/user/getUploadSelfIdentity',p)  

//我的MBB
export const userMbb = p => post('v1/coin/userMbb',p)  
//赠送记录
export const getLog = p => post('v1/User/getLog',p)  
//充币
export const coinIn = p => post('v1/Coin/coinIn',p)  
//提币
export const coinOut = p => post('v1/Coin/coinOut',p)  
//提币手续费
export const coinSet = p => post('v1/Coin/coinSet',p)  
//mbb充提币记录
export const userCoinInoutList = p => post('v1/Coin/userCoinInoutList',p)  
//mbb释放记录
export const userCoinUnlockList = p => post('v1/Coin/userCoinUnlockList',p)  



