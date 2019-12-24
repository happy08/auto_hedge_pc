import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'iview';
import router from './route';
import store from './store';
import * as filters from './utils/util';
import 'iview/dist/styles/iview.css';
import './assets/less/common.less';
import App from './App.vue';
import { main } from "./controller/main";
import { closeMain,insertExchange,swithStatus } from "./controller/common";
import VueClipboard from 'vue-clipboard2'
console.log(require('electron').ipcRenderer)
require('electron').ipcRenderer.setMaxListeners(20)
import update from './utils/upgrade';
// Vue.use(ErrorPlugin)
// 升级脚本
import './utils/upgrade';
import Bus from './utils/bus'
// require('events').EventEmitter.defaultMaxListeners = 0
Vue.use(VueRouter);
Vue.use(iView);
Vue.use(VueClipboard)
import { parameterSortMd5, paramMd5,setToken,getToken,setUserInfo,getUserInfo,removeUserInfo} from  './utils/common'; 
Vue.prototype.$parameterSortMd5 = parameterSortMd5;
Vue.prototype.$paramMd5 = paramMd5;
Vue.prototype.$setToken = setToken;
Vue.prototype.$getToken = getToken;
Vue.prototype.$setUserInfo = setUserInfo;
Vue.prototype.$getUserInfo = getUserInfo;
Vue.prototype.$removeUserInfo = removeUserInfo;
Vue.prototype.$vertifyURL = "http://test.mbbsystem.com/v1/Login/verify";

//设置主程序开关信号
localStorage['mainCheck']='0';
 
Object.keys(filters).forEach(k => Vue.filter(k, filters[ k ]));
 
if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'));
}
Vue.config.productionTip = false;
closeMain();
update()
// 导航守卫
router.beforeEach((to, from, next) => {
  Bus.$emit('mainCheck');
  let user_id = getUserInfo()?getUserInfo().id:false;
  //console.log('user_id',user_id)
  let mainCheck = localStorage['mainCheck'];

  if(mainCheck && mainCheck!='undefined' && mainCheck =='1'){
    mainCheck = true;
  }else{
    mainCheck = false;
  }
  swithStatus().then(res1=>{
    if(!mainCheck && user_id && res1 == "open"){
      //启动主程序
      ////console.log('开始对冲----------------------------------------------------')
      // localStorage['mainCheck'] = '1'
      // Bus.$emit('mainCheck');
        //  openMain().then(res2=>{
        //    setTimeout(()=>{
        //     // main(user_id);
        //    },5000)
        //  });
    }
  });


  if(user_id && to.fullPath.indexOf("login") > 0 ){
    next('/home')
  } else if(!user_id && to.fullPath.indexOf("login") < 0){
    next('/login')
  }else{
    next()
  }
  // insertExchange().then(res=>{
  //   if(res){
    
  //   }else{
  //     window.warn('发生错误，请重新打开客户端')
  //   }
  // })

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
