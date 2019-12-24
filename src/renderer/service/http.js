import http from "axios";
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，
import router from '../route' 
import { removeToken, removeUserInfo, paramMd5 } from "@/utils/common";
import { closeMain } from "../controller/common";
import { sleep } from "../utils/common";
const { ipcRenderer } = require("electron");
let canTry = true
// http 配置
http.defaults.timeout = 60000;
// http.defaults.baseURL = "https://hege-api.mbbsystem.com/";
http.defaults.baseURL = "http://test.mbbsystem.com/";  //测试 http://hedgingapi.bicir.net/
// http request 拦截器
http.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
//在main.js设置全局的请求次数，请求的间隙
http.defaults.retry = 2;
http.defaults.retryDelay = 1000;

// http response 拦截器
http.interceptors.response.use(
  async response => {
    canTry =true;
    // console.log('网络连接')
    localStorage['canTry'] = '1'
    const res = response.data
    if (res.code === 4401 && res.message == 'token错误') {
      removeToken()
      removeUserInfo()
      await closeMain();
      localStorage["mainCheck"] = "0";
      ipcRenderer.send('mainCheck', 'msg');
      setTimeout(function () {
        router.replace({
          path: '/login'
        })
      }, 300)
    }
    return response;
  }, async (error) => {
      canTry =false;
      localStorage['canTry'] = "0"
    // 错误抛到业务代码
      error.data = {}
      error.data.msg = '服务器异常，请联系管理员！'
      // window.warn("网络中断");
      // console.log('网络中断')
      await sleep()
      return Promise.resolve(-1)
  }
);
export default http;
// let apiURL = 'https://hege-api.mbbsystem.com/';
let apiURL = 'http://test.mbbsystem.com/'; //测试
export function get(urlbase, params, loadingFlag = true, type) {
  let url = apiURL + urlbase
  if (type) {
    url = urlbase
  }

  try {
    return new Promise((resolve, reject) => {
      http.get(url, {
        params: params
      }).then(res => {
       
        resolve(res.data);
      }).catch(async err => {
        // await closeMain();
        // localStorage["mainCheck"] = "0";
        // ipcRenderer.send('mainCheck', 'msg');
        console.log('网络中断')
       
        // window.warn("网络中断");
        resolve(0);
      })
    });
  } catch (e) {
    console.log('网络中断')
    resolve(0);
  }
}

/** 
* post方法，对应post请求 
* @param {String} url [请求的url地址] 
* @param {Object} params [请求时携带的参数] 
*/
export function post(url, params, loadingFlag = true) {
  url = apiURL + url;
  return new Promise((resolve, reject) => {
    try {
      http.post(url, QS.stringify(params))
        .then(res => {
         
          resolve(res.data);
        })
        .catch(async err => {
          console.log('网络中断')
          // await closeMain();
          // localStorage["mainCheck"] = "0";
          // ipcRenderer.send('mainCheck', 'msg');
        
          // window.warn("网络中断");
          reject(err.data)
        })
    } catch (e) {
      console.log('网络中断')
    }

  });
}

/** 
* post方法，对应post请求 
* @param {String} url [请求的url地址] 
* @param {Object} params [请求时携带的参数] 
*/
export function postJSON(url, params, loadingFlag = true) {
  // url = apiURL + url;
  // let loading
  // if (loadingFlag) {
  //   loading = vm.$createToast({
  //     time: 0,
  //     type: 'loading',
  //     mask: true
  //   }).show()
  // }
  // return new Promise((resolve, reject) => {
  //   http.post(url, JSON.stringify(params))
  //     .then(res => {
  //       resolve(res.data);

  //     })
  //     .catch(err => {
  //       reject(err.data)
  //     })
  // });
}