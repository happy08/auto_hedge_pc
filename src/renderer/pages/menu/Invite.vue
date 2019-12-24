<template>
  <div class="content_box">
    <div class="left">
      <h2>邀请好友</h2>
      <div class="input_wrap">
        <p>邀请地址</p>
        <div>
          <input
            type="text"
            readonly
            :value="inviteCodeData?inviteCodeData.invite_url+'&id='+invite_code:'暂未设置'"
          />
          <p
            v-clipboard:copy="inviteCodeData?inviteCodeData.invite_url+'&id='+invite_code:'暂未设置'"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >复制</p>
        </div>
      </div>
      <p>邀请二维码:</p>
      <div class="QR_code">
        <div class="placeholder"></div>
        <div class="qr_wrap">
          <!-- <vue-qr
            :text="'http://hedgingapi.bicir.net/v1/Reg/regAct?id='"
            :callback="creatImg"
            :margin="0"
            :whiteMargin="true"
            :size="144"
            :colorDark="`#000`"
            :colorLight="`#fff`"
          ></vue-qr>-->
          <div id="qrcode" class="two-code" ref="qrcode"></div>
        </div>
        <div class="authorization">
          <p>授权码:</p>
          <p>{{invite_code?invite_code:'暂未设置'}}</p>
        </div>
      </div>
    </div>
    <div class="right">
      <h2>我的好友</h2>
      <p>好友总数: {{total}}</p>
      <div class="table_wrap">
        <div class="table_t">
          <p>注册时间</p>
          <p class="text_center">用户名</p>
          <p class="text_center">注册账号</p>
          <p class="text_right">好友等级</p>
        </div>
        <div class="table_l" v-for="(item,index) in getFriendData" :key="index">
          <p>{{item.add_time}}</p>
          <p class="text_center">{{item.user_name}}</p>
          <p class="text_center">{{item.phone=='******'?toStart(item.email):item.phone}}</p>
          <p class="text_right">{{item.level|level}}</p>
        </div>

        <div v-if="getFriendData && getFriendData.length>0" class="pagetion">
          <Page :total="total" :page-size="limit" show-elevator @on-change="pageEvent"></Page>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from "../../utils/util";
import { getFriend, getInviteCode } from "../../service/api.js"; //接口
import QRCode from "qrcodejs2";
export default {
  components: {
  },
  data() {
    return {
      total: 0,
      page_size: 0,
      limit: 10,
      getFriendData: {},
      inviteCodeData: null,
      invite_code: -1
    };
  },
  computed: {},
  created() {
    this._getFriend(1);
    this._getInviteCode();
  },
  methods: {
    qrcode(qr_code) {
      let qrcode = new QRCode("qrcode", {
        width: 120,
        height: 120,
        text: this.inviteCodeData?this.inviteCodeData.invite_url+'&id='+this.invite_code:'暂未设置'
      });
    },
    getQrcode() {
      this.$nextTick(() => {
        this.qrcode();
      });
    },
    creatImg() {},
    async _getFriend(index) {
      let res = await getFriend(
        this.$paramMd5([`page=${index}`, `limit=${this.limit}`])
      );
      if (res&&res.code == 1) {
        this.total = res.data.total?res.data.total:0;
        this.getFriendData = res.data.data
      } else {
        window.warn(res.message);
      }
    },
    async _getInviteCode(index) {
      let res = await getInviteCode(this.$paramMd5([]));
      if (res && res.code == 1) {
        this.inviteCodeData = res.data;
        let inviteString = this.inviteCodeData.invite_code +"";
        if( this.inviteCodeData && this.inviteCodeData.invite_code){
         
          if(inviteString.length<6){
            let pushNum = 6 - inviteString.length
            for(let i =0;i<pushNum;i++){
              inviteString="0"+inviteString
            }
          }
        }
        this.invite_code =inviteString?inviteString:'暂无';
        this.getQrcode();
      } else {
        window.warn(res.message);
      }
    },
    pageEvent(index) {
      this._getFriend(index);
    },
    onCopy() {
      window.success("复制成功");
    },
    // 复制失败
    onError() {
      window.success("复制失败");
    },
    toStart (str) {
      return str.length>3?str.substr(0, 3) + "*****" + str.substr(-3):str
    }
  },
  filters:{
    level(val){
      if(val==1){
        return '一级好友'
      }else if(val==2){
        return '二级好友'
      }
    },
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/less/common.less";

.content_box {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: start;
}
.left {
  width: 460px;
  min-width: 460px;
  max-width: 460px;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
  border-radius: 10px;
  h2 {
    margin-top: 20px;
    margin-left: 20px;
    height: 18px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #1E47A6;
    line-height: 18px;
  }
  > p {
    height: 14px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(78, 98, 113, 1);
    margin-left: 20px;
  }
  .input_wrap {
    display: flex;
    margin: 20px 0 20px 20px;
    width: 420px;
    box-sizing: border-box;
    > p {
      width: 100px;
      height: 40px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(83, 105, 118, 1);
      line-height: 40px;
    }
    > div {
      display: flex;
      justify-content: space-between;
      > input {
        width: 200px;
        height: 40px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 40px;
        padding-left: 15px;
        box-sizing: border-box;
      }
      > p {
        width: 80px;
        height: 40px;
        background: rgba(0, 185, 159, 1);
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        margin-left: 40px;
        cursor: pointer;
      }
    }
  }
}
.right {
  width: 100%;
  height: 100%;
  margin-left: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
  border-radius: 10px;
  > h2 {
    margin-top: 20px;
    margin-left: 20px;
    height: 18px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #1E47A6;
    line-height: 18px;
  }
  > p {
    height: 14px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(78, 98, 113, 1);
    line-height: 14px;
    text-align: right;
    padding-right: 40px;
    min-width: 300px;
  }
  .table_wrap {
    // width: 420px;
    height: calc(100% - 70px);
    padding: 0px 20px 20px 20px;
    overflow-y: scroll;
    margin-top: 20px;
  
  }
}
.QR_code {
  max-width: 320px;
  height: 400px;
  background: url("../../assets/img/invite_1.png") no-repeat center;
  background-size: 320px 400px;
  margin: 30px 0px 60px 120px;

  .qr_wrap {
    width: 180px;
    height: 180px;
    background: url("../../assets/img/invite_2.png") no-repeat center;
    background-size: 180px 180px;
    margin-left: 70px;
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    > #qrcode {
       width: 180px;
    height: 180px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    }
  }
  .placeholder {
    height: 97px;
  }
  .authorization {
    margin-top: 38px;
    display: flex;
    justify-content: center;
    > p {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(254, 254, 254, 1);
      margin-right: 30px;
    }
  }
}
.pagetion {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
