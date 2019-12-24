<template>
  
    <!-- <p v-show="!msmFlag">{{wait_timer}}S</p> -->
    <p class="send-sms"><span v-show="!msmFlag">{{wait_timer}}S</span> <span @click="sendMsg" v-show="msmFlag">{{send}}</span></p>
  
</template>     
<script>
import { sendSms, sendEmail } from "@/service/api.js"; //接口
export default {
  name: "sendSmsOrEmail",
  props: {
    type: {
      //sendSms 1注册 2找回登陆密码 3交易密码 4账号转账（登录）  
      //sendEmail 1注册 2其他
      type: Number
    }
  },
  data() {
    return {
      wait_timer: 60,
      msmFlag: true,
      send: "获取验证码",
      userInfo:""
    };
  },
  computed: {},
  created() {
    this.userInfo = this.$getUserInfo();    
  },
  methods: {
    async sendMsg() {
        this.wait_timer = 60;
        this.msmFlag = false;
        var timer_interval = setInterval(() => {
          if (this.wait_timer > 0) {
            this.wait_timer--;
          } else {
            this.msmFlag = true;
            this.send = "重新发送";
            clearInterval(timer_interval);
          }
        }, 1000);


      //console.log('this.userInfo',this.type,'--',this.userInfo,this.userInfo.phone);
      let res = ''
      let self_type = 2;
      //手机
      if(this.userInfo.phone != '' && this.userInfo.phone !== undefined){
        if(this.type !== undefined){
          self_type=this.type
        }
        res = await sendSms(
          this.$paramMd5([`phone=${this.userInfo.phone}`, `type=${self_type}`])
        );
      }else{
        //邮箱
        res = await sendEmail(
          this.$paramMd5([`email=${this.userInfo.email}`, `type=2`])
        );
      }
      // let res = await sendSms(
      //   this.$paramMd5([`phone=${this.phone}`, `type=2`])
      // );
      if (res && res.code == 1) {
      } else {
        this.msmFlag = true;
        this.send = "重新发送";
        clearInterval(timer_interval);

        this.$Notice.error({
          title: res.message
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.send-sms{
  min-width: 98px;
  span{
    display: block;
  }
}
 
</style>
