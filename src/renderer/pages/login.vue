<template>
  <div class="login_wrap" @dblclick="reWindows" style="-moz-user-select:none;">
    <div class="header">
      <div>MBB 移动积木量化交易平台</div>
      <div class="right">
        <a href="javascript:void(0)" @click="minWindows">
          <i class="icon-minus"></i>
        </a>
        <a href="javascript:void(0)" @click="reWindows">
          <i class="icon-max"></i>
        </a>
        <a href="javascript:void(0)" @click="closeWindows">
          <i class="icon-close"></i>
        </a>
      </div>
    </div>
    <div class="login_form_wrap">
      <div class="logo">
        <h2 class="text_c fs-30">MBB移动积木量化对冲交易平台</h2>
        <div class="title_en text_c fs-16">Mobile building blocks quantitative trading platform</div>
      </div>
      <div class="login_form">
        <Tabs :animated="true" class="cus-tabs-tab">
          <TabPane label="手机登录">
            <div class="content">
              <div class="input_wrap">
                <p>账号：</p>
                <div>
                  <input type="text" class="name" v-model="phone" maxlength="11"  placeholder="手机号码"/>
                </div>
              </div>
              <div class="input_wrap">
                <p>验证码：</p>
                <div>
                  <input type="text" class="msgCode" v-model="verifyCode" maxlength="6" />
                  <p class="getMsmCord" v-if="msmFlag" @click="sendMsg"></p>
                  <p v-show="!msmFlag" class="send">{{wait_timer}}S</p>
                  <div v-show="msmFlag" class="send" @click="sendMsg">{{send}}</div>
                </div>
              </div>
              <div class="input_wrap">
                <p>密码：</p>
                <div>
                  <input type="password" class="password" v-model="password" @keyup.enter="login" />
                </div>
              </div>

              <div class="submit_btn" @click="login">登录</div>
            </div>
          </TabPane>

          <TabPane label="邮箱登录">
            <div class="content">
              <div class="input_wrap">
                <p>账号：</p>
                <div>
                  <input type="text" class="name" v-model="form.email" placeholder="邮箱" />
                </div>
              </div>
              <div class="input_wrap">
                <p>密码：</p>
                <div>
                  <input type="password" class="password" v-model="form.password" @keyup.enter="emailLogin" />
                </div>
              </div>

              <div class="submit_btn" @click="emailLogin">登录</div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { swithStatus, openMain, closeMain } from "../controller/common";
import Bus from "@/utils/bus";
import { removeToken, removeUserInfo, sleep } from "@/utils/common";
import { getUserInfo } from "@/service/api";

import { loginact, emailLogin, loginout, sendSms } from "../service/api.js"; //接口
export default {
  data() {
    return {
      phone: "",
      password: "",
      verifyCode: "",
      wait_timer: 60,
      msmFlag: true,
      send: "发送",
      timer_interval: null,
      form:{
        email:'',
        password:''
      }
    };
  },
  created(){
     this.$router.push({
        path: "/home"
      });
     //loginout( this.$paramMd5([]));
    // console.log(123)
  },
  methods: {
    reWindows() {
      this.$electron.ipcRenderer.send("reMax-window");
    },
    minWindows() {
      this.$electron.ipcRenderer.send("min-window");
    },
    maxWindows() {
      this.$electron.ipcRenderer.send("max-window");
    },
    closeWindows() {
      this.$Modal.confirm({
        title: "确定要离开程序吗？",
        content: "",
        onOk: () => {
          this.$electron.ipcRenderer.send("close-window");
          // this.$Message.info('Clicked ok');
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel');
        }
      });
      // this.$electron.ipcRenderer.send("close-window");
    },

    async login() {
      this.$router.push({
        path: "/home"
      });
      if (this.phone.length != 11) {
        window.warn("请输入正确的手机号码", 1);
        return;
      }
      if (this.verifyCode == "") {
        window.warn("请输入短信验证码", 1);
        return;
      }
      if (this.password == "") {
        window.warn("请输入登录密码", 1);
        return;
      }
      let res = await loginact(
        this.$parameterSortMd5([
          `phone=${this.phone}`,
          `verifyCode=${this.verifyCode}`,
          `password=${this.password}`
        ])
      );
      //console.log("login res", res.code == 1);
      if (res && res.code == 1) {
        this.$setToken(res.data.token);
        this.$setUserInfo(res.data);
        this.$router.push({
          path: "/home"
        });
      } else {
        res && res.message && window.warn(res.message, 1);
      }
    },
    async emailLogin() {
      if (this.form.email == "") {
        window.warn("请输入邮箱", 1);
        return;
      }
      if (this.form.password == "") {
        window.warn("请输入登录密码", 1);
        return;
      }
       let regemail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (!regemail.test(this.form.email)) {
        window.warn("邮箱格式错误", 1);
        return;
      }
      let res = await emailLogin(
        this.$parameterSortMd5([
          `email=${this.form.email}`,
          `password=${this.form.password}`
        ])
      );
      if (res && res.code == 1) {
        this.$setToken(res.data.token);
        this.$setUserInfo(res.data);
        this.$router.push({
          path: "/home"
        });
      } else {
        res && res.message && window.warn(res.message, 1);
      }
    },

    async sendMsg() {
      if (this.phone.length != 11) {
        window.warn("请输入正确的手机号码", 1);
        return;
      }
      let res = await sendSms(
        this.$parameterSortMd5([`phone=${this.phone}`, `type=4`])
      );

      if (res && res.code == 1) {
        this.wait_timer = 60;
        this.msmFlag = false;
        this.timer_interval = setInterval(() => {
          if (this.wait_timer > 0) {
            this.wait_timer--;
          } else {
            this.msmFlag = true;
            this.send = "重新发送";
            clearInterval(this.timer_interval);
            this.timer_interval = null;
          }
        }, 1000);
      } else {
        window.warn(res.message, 1);
      }
    }
  },
  destroyed() {
    //清除定时器
    this.timer_interval && clearInterval(this.timer_interval);
    this.timer_interval = null;
  }
};
</script>
<style lang="less" scoped>
@import "../assets/less/global.less";
@import "../assets/less/mixin.less";
@import "../assets/less/common.less";
 .logo{
   padding-top: 180px;
   height: 300px;
   margin: 0 auto;
   background: url(../assets/img/logo.png) center no-repeat;
   background-size: 63%
 }
.title_en{
  color: #ffffff;
  padding: 5px 0;
}
/deep/ .cus-tabs-tab {
  .ivu-tabs-bar {
    border-bottom: 0px solid #dcdee2;
    margin-bottom: 0px;
  }
  &.ivu-tabs .ivu-tabs-tabpane {
    visibility: visible !important;
     background: #3273CC;
  }
  .ivu-tabs-nav {
    display: flex;
    width: 100%;
    .ivu-tabs-tab {
      flex: 1;
      text-align: center;
      font-size: 18px;
      padding: 20px 16px;
      margin-right: 0px;
      color: #c9d6ff;
      background: #3273CC;
    }
    .ivu-tabs-tab-active {
      background: #074daf;
      color: #fff;
    }
    .ivu-tabs-ink-bar {
      display: none;
    }
  }
}

.content {
  padding: 40px 60px;
  border-radius: 0 0 10px 10px;
  background: #3273CC;
}

.home-background {
  position: relative;
  background-color: @bg-login-color;
}
.login_wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("../assets/img/login_bg.jpg") no-repeat center;
  background-size: cover;
  background-attachment: fixed;
}
.right {
  float: right;
  display: flex;
  a {
    -webkit-app-region: no-drag;
    color: rgba(201, 214, 255, 1);
    padding-right: 10px;
    flex: 1;
  }
}
.icon-minus {
  display: inline-block;
  margin: 0 auto;
  width: 15px;
  height: 15px;
  overflow: hidden;
  vertical-align: middle;
  margin-top: 10px;
  background-size: 100%;
  background-repeat: no-repeat;
  .bg-image("../img/l_shouqi");
}
.icon-max {
  display: inline-block;
  margin: 0 auto;
  width: 15px;
  height: 15px;
  overflow: hidden;
  vertical-align: middle;
  margin-top: 1px;
  background-size: 100%;
  background-repeat: no-repeat;
  .bg-image("../img/l_zuidahua");
}
.icon-close {
  display: inline-block;
  margin: 0 10px 0 0;
  width: 15px;
  height: 15px;
  overflow: hidden;
  vertical-align: middle;
  margin-top: -2px;
  background-size: 100%;
  background-repeat: no-repeat;
  .bg-image("../img/l_guanbi");
}
.header {
  display: flex;
  justify-content: space-between;
  padding: 20px 10px 0px 20px;
  -webkit-app-region: drag;
  div:nth-child(1) {
    height: 20px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(201, 214, 255, 1);
    line-height: 20px;
  }
  div:nth-child(2) {
    height: 20px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(201, 214, 255, 1);
    line-height: 20px;
  }
}
.login_form_wrap {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0px auto;
  width: 480px;
  h2 {
    color: #FFFFFF;
  }
  .login_form {
    margin-top:-20px;
    width: 480px;
    height: 440px;
    overflow: hidden;
    border-radius: 10px;
      box-shadow:-7px 7px 9px 1px rgba(0, 0, 0, 0.15);
    .input_wrap {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      > p {
        height: 40px;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 40px;
      }
      > div {
        display: flex;
        width: 280px;
        height: 40px;
        justify-content: space-between;
        input {
          background: #FFFFFF;
          border: none;
          padding-left: 15px;
          color: #3273CC;
        }
        .name,
        .password {
          width: 280px;
          height: 40px;
        }
        .msgCode {
          width: 160px;
          height: 40px;
        }
        .send {
          width: 79px;
          height: 40px;
          background: #FFFFFF;
          height: 40px;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #3273CC;
          line-height: 40px;
          text-align: center;
          cursor: pointer;
        }
      }
    }

    .submit_btn {
      width: 100%;
      height: 60px;
      background: #FFFFFF;
      text-align: center;
      line-height: 60px;
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #3273CC;
      cursor: pointer;
    }
  }
}

</style>
