<template>
  <div id="app">
    <Spin fix v-if="showSpin">
    </Spin>
    <router-view style="height: 100%;" v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
import Bus from "./utils/bus";
import { swithStatus } from "./controller/common";
export default {
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true,
      canGo: true,
      showSpin: false,
 
    };
  },
  created() {
    let _this = this;
    Bus.$on("logout", target => {
      _this.showSpin = true;
 
    });
    Bus.$on("logoutEnd", target => {
      _this.showSpin = false;
 
    });
    var webFrame = require("electron").webFrame;
    console.log(webFrame);
    webFrame.setVisualZoomLevelLimits(1, 1);
    window.warn = this.warn;
    window.success = this.success;
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    warn(msg, type) {
      let user_id = this.$getUserInfo() ? this.$getUserInfo().id : false;
      if (!type && !user_id) {
        return;
      }

      let canTry = localStorage["canTry"];

      if (!this.canGo) {
        return;
      }
      let time = 4.5;
      if (canTry == 0) {
        time = 0;
      }
      this.$Notice.error({
        title: msg,
        duration: time,
        onClose: () => {
          this.canGo = true;
        }
      });
      if (canTry == 0) {
        this.canGo = false;
      } else {
        this.canGo = true;
      }
    },
    success(msg) {
      this.$Notice.success({
        title: msg
      });
    }
  }
};
</script>

<style lang="less">
@import "./assets/less/mixin.less";
html,
body,
#app {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  // overflow-y: scroll;
  touch-action: none;
}

body {
  color: #333;
  -moz-user-select: none; /* Firefox私有属性 */
  -webkit-user-select: none; /* WebKit内核私有属性 */
  -ms-user-select: none; /* IE私有属性(IE10及以后) */
  -khtml-user-select: none; /* KHTML内核私有属性 */
  -o-user-select: none; /* Opera私有属性 */
  user-select: none; /* CSS3属性 */
}
/*------------------开关---------------------------------*/
.ivu-spin-fix {
  z-index: 9000 !important;
}
/*------------------开关---------------------------------*/
.ivu-switch-checked {
  border-color: #5ec29a !important;
  background-color: #5ec29a !important;
}
/*------------------选择器---------------------------------*/
.ivu-select-arrow {
  right: 10px !important;
  display: inline-block !important;
  margin: -0px auto 0px auto !important;
  width: 9px !important;
  height: 12px !important;
  overflow: hidden !important;
  vertical-align: middle !important;
  // margin-top: 10px;
  background-size: 100% !important;
  background-repeat: no-repeat !important;
  .bg-image("../img/select");
}
.ivu-icon-ios-calendar-outline {
  right: 10px !important;
  display: inline-block !important;
  margin: 8px auto 0px auto !important;
  width: 11px !important;
  height: 11px !important;
  overflow: hidden !important;
  vertical-align: middle !important;
  // margin-top: 10px;
  background-size: 100% !important;
  background-repeat: no-repeat !important;
  .bg-image("../img/calendar");
}
.ivu-input-with-suffix {
  input::input-placeholder {
    color: #bdbdbd;
  }
}
.ivu-select
  .ivu-select-visible
  .ivu-select-single
  .ivu-select-large
  .ivu-select-placeholder,
.ivu-input,
.ivu-select-selection {
  width: 80px !important;
  height: 30px !important;
  margin-right: 20px !important;
  font-size: 12px !important;
  font-family: Source Han Sans CN !important;
  font-weight: bold !important;
  color: rgb(0, 0, 0) !important;
  line-height: 30px !important;
  text-align: center !important;
  cursor: pointer !important;
  background: #00b99f !important;
  border-radius: 0 !important;
  border: none !important;
  font-weight: 400 !important;
  color: rgba(255, 255, 255, 1) !important;
  line-height: 36px !important;
}
.ivu-input {
  width: 160px !important;
  font-weight: 400 !important;
  color: rgba(255, 255, 255, 1) !important;
  line-height: 36px !important;
}
.ivu-input-wrapper {
  width: 160px !important;
}
.ivu-icon-ios-arrow-down:before {
  content: "" !important;
}
.ivu-icon-ios-calendar-outline:before {
  content: "" !important;
}
.ivu-select-large.ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-large.ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  font-size: 12px !important;
  font-weight: 400 !important;
  color: rgba(255, 255, 255, 1) !important;
  line-height: 30px !important;
  height: 30px !important;
}

.ivu-menu-item {
  font-size: 16px !important;
}
.cus-select .ivu-select-selection{
  width: 100% !important;
  background: #E3F8FE !important;
  color: #666 !important;
  text-align: left !important;
  font-weight: 800 !important;
  height: 38px !important;
  line-height: 38px !important;
}
.cus-select.ivu-select-single .ivu-select-selection .ivu-select-placeholder{
    color: #666666 !important;
    font-size: 14px !important;
    font-weight: 800 !important;
    line-height: 40px !important;
    height: 40px !important;
}
.cus-select.ivu-select-large.ivu-select-single .ivu-select-selection .ivu-select-placeholder, .cus-select.ivu-select-large.ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    height: 40px !important;
    color: #666666 !important;
    font-weight: 800 !important;
    line-height: 40px !important;
    font-size: 14px !important;
}
.cus-select .ivu-select-arrow{
    width: 12px !important;
}
.cus-select .ivu-icon-ios-arrow-down:before {
    content: "\F116" !important;
}

/*------------------radio---------------------------------*/
.cus_radio .ivu-radio-inner{
  width: 18px;
  height: 18px;
  border-radius: 0;
}
.cus_radio .ivu-radio-inner:after{
    background-color: #00b99f;
    top: 6px;
    left: 4px;
    width: 2px;
    height: 7px;
    transform: rotateZ(-45deg);
}
.cus_radio .ivu-radio-inner::before{
    content: '';
    position: absolute;
    opacity: 0;
    left: 10px;
    display: table;
    top: 2px;
    background-color: #00b99f;
    width: 2px;
    height: 10px;
    transform: rotateZ(45deg);
    transition: all .2s ease-in-out;
}
.cus_radio .ivu-radio-checked .ivu-radio-inner:before{
    opacity:1;
}
.cus_radio .ivu-radio-checked .ivu-radio-inner {
    border-color: #00b99f;
}
/*------------------表格---------------------------------*/
button {
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1.5;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 5px 5px 6px !important;
  font-size: 12px;
  border-radius: 0px !important;
  -webkit-transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, -webkit-box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, -webkit-box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, box-shadow 0.2s linear, -webkit-box-shadow 0.2s linear;
  color: #515a6e;
  background-color: #fff;
  border-color: #dcdee2;
  outline: none; /*按钮点击后，不出现框框*/
}
button:focus {
  -webkit-box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
}

// button,
// button:active,
// button:focus {
//   outline: 0;
// }

// .ivu-date-picker {
//   display: inline-block;
//   line-height: normal;
//   vertical-align: top;
// }

.ivu-table-border td,
.ivu-table-border th {
  border-right: none;
}
.ivu-table th {
  background-color: #ffffff;
}
.ivu-table td,
.ivu-table th {
  border-bottom: none;
}
.ivu-table-wrapper {
  border: none;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.ivu-table:before {
  background-color: #ffffff;
}
.ivu-table:after {
  background-color: #ffffff;
}
/*------------------左侧菜单---------------------------------*/
.ivu-menu-dark {
  background: rgba(255, 255, 255, 0);
}
.ivu-menu-vertical .ivu-menu-item {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0);
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover,
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover {
  background: rgba(255, 255, 255, 0);
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
  color: #1E47A6 !important;
  border-right: none !important;
  background: none !important;
}
  .layout-menu-left {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 40px;
    .left {
      width: auto;
      transition: all .6s;
      padding:10px 15px;
      border-left: rgba(255, 255, 255, 0) solid 2px;
      color: #FFFFFF;
      >p{
        line-height: 1;
        transform: translateX(3px);
        transition: all .5s;
        padding-left: 25px;
        border-left: transparent solid 2px !important;
      }
    }
  }
  .aside-drop-menu {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    .ivu-dropdown {
      .ivu-dropdown-rel {
        cursor: pointer;
      }
    }
  }
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu)
  .left,
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-submenu-title-active:not(.ivu-menu-submenu)
  .left {
  background: #FFFFFF !important;
  box-shadow:-4px 4px 2px 0px rgba(0, 0, 0, 0.1);
}
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu)
  .left p,
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-submenu-title-active:not(.ivu-menu-submenu)
  .left p {
    transform: translateX(0px);
  border-left: #1E47A6 solid 2px !important;
  color: #1E47A6 !important;
}
.ivu-icon-clipboard {
  margin-left: 2px;
}

/*------------------页码---------------------------------*/
.ivu-page {
  margin: 15px 20px 0 0;
  float: right;
}

/*------------------滚动条---------------------------------*/
::-webkit-scrollbar {
  height: 8px;
  width: 8px;
  background: transparent;
  border-radius: 4px;
}

::-webkit-scrollbar-button {
  display: none;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-track-piece {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  width: 8px;
  min-height: 15px;
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:active,
::-webkit-scrollbar-thumb:hover {
  background: #7d7d7d;
}

/*------------------表格中气泡---------------------------------*/

.table-tooltip {
  width: 100%;
  .ivu-tooltip-rel {
    width: 100%;
    div {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.shade{
   animation:shadeAni .5s;
    background: rgba(0,0,0,.3) !important;
    opacity: 1 !important;
}
.pop{
   animation:popAni .5s;
}
@keyframes popAni {
    0% {
      transform: translateY(-30px);
      opacity: 0;
    }
    100% {
      transform: translateY(0px);
      opacity: 1
    }
}
@keyframes shadeAni {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1
    }
}

</style>
