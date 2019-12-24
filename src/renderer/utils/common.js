import md5 from 'js-md5';
const TokenKey = 'token';
const USERINFO = 'userinfo'

import { getUserInfo as getUserInfo_ } from "../service/api";


export function getToken() {
  if (localStorage[TokenKey] != 'undefined') {
    return JSON.parse(localStorage[TokenKey]);
  }
}

export function setToken(token) {
  localStorage[TokenKey] = JSON.stringify(token);
}
async function getUserInfo_new(index) {
  let res = await getUserInfo_(paramMd5([]));
 
  if (res && res.code == 1) {
    return res.data.auth
  } else {
    return 0
  }

}

export async function getVip() {
  if (localStorage[USERINFO] != undefined) {
    let auth = await getUserInfo_new()

    let vip = auth > 0 ? true : false
    return vip;
  }
  return false;
}

export function getUserInfo() {
  if (localStorage[USERINFO] != undefined) {

    let newInfo = JSON.parse(localStorage[USERINFO]);

    return newInfo;
  }
  return false;
}
// {"id":"2761","token":"99ba3049804b34a8a0501c3b26478a67","user_name":"z1234","phone":"13542880172","is_real":"0","name":"","idcard":"","level_type":"游客","usdt":"0.00","auth":0,"income":"","incomeRank":""}
export function setUserInfo(userinfo) {
  userinfo.time = new Date().getTime();
  localStorage[USERINFO] = JSON.stringify(userinfo);
}

export function removeToken() {
  return localStorage.removeItem(TokenKey);
}

export function dictionary() {
  return {
    '1':1
  }
}

export function removeUserInfo() {
  localStorage["selectM" + "中币网"] = "0"
  localStorage["selectM" + "比特儿"] = "0"
  localStorage["selectM" + "OKEx"] = "0"
  localStorage['中币网/比特儿,BTC/USDT'] = "0"
  localStorage['中币网/比特儿,ETH/USDT'] = "0"
  localStorage['中币网/比特儿,ETC/USDT'] = "0"
  localStorage['中币网/比特儿,LTC/USDT'] = "0"
  localStorage['中币网/比特儿,EOS/USDT'] = "0"
  localStorage['中币网/OKEx,BTC/USDT'] = "0"
  localStorage['中币网/OKEx,ETH/USDT'] = "0"
  localStorage['中币网/OKEx,ETC/USDT'] = "0"
  localStorage['中币网/OKEx,LTC/USDT'] = "0"
  localStorage['中币网/OKEx,EOS/USDT'] = "0"
  localStorage['比特儿/OKEx,BTC/USDT'] = "0"
  localStorage['比特儿/OKEx,ETH/USDT'] = "0"
  localStorage['比特儿/OKEx,ETC/USDT'] = "0"
  localStorage['比特儿/OKEx,LTC/USDT'] = "0"
  localStorage['比特儿/OKEx,EOS/USDT'] = "0"
  localStorage["selectC" + "BTC"] = "0"
  localStorage["selectC" + "ETH"] = "0"
  localStorage["selectC" + "ETC"] = "0"
  localStorage["selectU" + "USDT"] = "0"
  localStorage["selectC" + "EOS"] = "0"
  localStorage["selectC" + "LTC"] = "0"
  localStorage["selectC" + "ETC"] = "0"
  return localStorage.removeItem(USERINFO);
}
export function sleep(millseconds) {
  if (!millseconds) {
    millseconds = 200;
  }
  return new Promise(resolve => {
    setTimeout(resolve, millseconds);
  });
}

export function sort_ASCII(obj) {
  let arr = [];
  let num = 0;
  for (let i in obj) {
    arr[num] = i;
    num++;
  }
  let sortArr = arr.sort();
  let sortObj = {};
  for (let j in sortArr) {
    sortObj[sortArr[j]] = obj[sortArr[j]];
  }
  return sortObj;
}

export function min(arr) {

  if (!arr) {
    return 0;
  }
  arr.sort(function (a, b) {
    let c = a - b;
    return c;
  });

  let min = arr[0];
  return min

}

/**
 * 参数排序并且加密
 */
export function parameterSortMd5(arr) {
  arr.sort();
  let md5_String = '';
  let newArr = [];
  let paramObj = {};
  for (let i = 0; i < arr.length; i++) {
    newArr = arr[i].split('=');
    paramObj[newArr[0]] = newArr[1];
    if (newArr[1]) {
      md5_String += newArr[1];
    }
  }
  paramObj.sig = md5(md5_String);
  return paramObj;
}
// 帶token uid的加密
export function paramMd5(arr) {
  // console.log( getUserInfo().token);
  // console.log( getUserInfo().id)
  let token = getUserInfo() ? getUserInfo().token : '';
  let uid = getUserInfo() ? getUserInfo().id : '';
  arr.push(`user_login_token=${token}`);
  arr.push(`token=${token}`);
  arr.push(`uid=${uid}`);
  // arr.push(`user_login_token=${token}`);
  // arr.push(`token=501142b2fdf5975556b6380c57bbf7fb`);
  // arr.push(`uid=2846`);
  arr.sort();
  let md5_String = '';
  let newArr = [];
  let paramObj = {};
  for (let i = 0; i < arr.length; i++) {
    newArr = arr[i].split('=');
    paramObj[newArr[0]] = newArr[1];
    if (newArr[1]) {
      md5_String += newArr[1];
    }
  }

  paramObj.sig = md5(md5_String);

  return paramObj;
}

//加    
export function floatAdd(arg1, arg2) {

  let r1, r2, m;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

//减    
export function floatSub(arg1, arg2) {

  // if (!arg1 ) {
  //   return 0;
  // }
  // if (arg1 &&!arg2 ) {
  //   return Math.abs(arg1);
  // }
  // if (!arg1 && !arg2 ) {
  //   return 0;
  // }
 

  let r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度    
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

//乘    
export function floatMul(arg1, arg2) {
  if (!arg1 || !arg2) {
    return 0;
  }
  let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}


//除   
export function floatDiv(arg1, arg2) {
  let t1 = 0, t2 = 0, r1, r2;
  try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
  try { t2 = arg2.toString().split(".")[1].length } catch (e) { }

  r1 = Number(arg1.toString().replace(".", ""));

  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}
