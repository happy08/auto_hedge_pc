<template>
  <div class="commission">
    <h2>提币</h2>
    <div class="form_wrap">
      <div class="input_wrap">
        <div>
          <input type="text" placeholder="请输入您的MBB钱包地址，输入错误会使您丢失数字资产" v-model="address" />
          <p @click="showPop">选择地址</p>
        </div>
      </div>
      <div class="input_wrap">
        <div>
          <input
            type="number"
            min="0"
            :placeholder="'可用 '+MbbNum+' MBB'"
            v-model="coin_num"
            @input="changeNum"
            onkeyup="this.value=this.value.replace(/^![1-9]\d*(\.\d+)?$/,'')"
          />
          <div>
            最少{{out_min}}MBB，单笔最高可提现{{out_max}}MB
            <br />
            <span class="red">手续费：{{out_fee}} MBB</span>
          </div>
        </div>
      </div>
      <div class="input_wrap">
        <div>
          <input
            type="text"
            class="yanzhen"
            maxlength="6"
            v-model="verifyCode"
            :placeholder="yzPlaceholder"
          />
          <send-sms-or-email></send-sms-or-email>

          <!-- <p v-show="!msmFlag">{{wait_timer}}S</p>
          <p v-show="msmFlag" @click="sendMsg">{{send}}</p>-->
        </div>
      </div>
      <div class="input_wrap">
        <div>
          <a class="submitBtn" @click="submitBtn">提交</a>
        </div>
      </div>
    </div>

    <div class="shade" v-show="popFlag"></div>
    <div class="pop" v-show="popFlag">
      <div class="close">
        <span class="icon-close" @click="closePop"></span>
      </div>

      <change-address @getAddress="getAddress" :addreessList="addreessList" v-show="popFlag"></change-address>
    </div>
  </div>
</template>
<script>
import ChangeAddress from "./ChangeAddress";
import sendSmsOrEmail from "../sendSmsOrEmail"; //发验证码
import { floatAdd, floatDiv, floatSub, floatMul } from "../../../utils/common";

import {
  //sendSms,
  coinOut,
  userMbb,
  coinSet,
  getAddrAction
} from "../../../service/api.js"; //接口
import Bus from "@/utils/bus";
export default {
  name: "Recharge",
  data() {
    return {
      popFlag: false,
      verifyCode: "",
      phone: "",
      address: "", //提币地址
      coin_num: "", //提币数量
      MbbNum: "", //可用MBB
      out_min: "", //最小
      out_max: "", //最大
      out_fee: "", //手续费
      type: "", //1手机 2邮箱

      addreessList: "", //地址列表
      addList: [], //只包含地址列表

      userInfo: "",
      yzPlaceholder: ""
    };
  },
  components: {
    ChangeAddress,
    sendSmsOrEmail
  },
  computed: {
    //手续费计算
    // out_fee_real(){
    //   return  this.out_fee&&this.coin_num?floatMul(floatDiv(Number(this.out_fee),100),Number(this.coin_num)):0
    // }
  },
  created() {
    this.userMbb();
    this.coinSet();
    this.getAddrAction();
    this.userInfo = this.$getUserInfo();
  },
  watch: {
    userInfo() {
      if (this.userInfo.phone != "" && this.userInfo.phone !== undefined) {
        this.type = 1;
        this.yzPlaceholder = "请输入手机验证码";
      } else {
        this.type = 2;
        this.yzPlaceholder = "请输入邮箱验证码";
      }
    }
  },
  methods: {
    async submitBtn() {
      if (this.address == "") {
        this.$Notice.error({
          title: "请输入MBB地址"
        });
        return;
      }
      // if (this.addList.indexOf(this.address) === -1) {  //废
      //   this.$Notice.error({
      //     title: "请输入MBB地址"
      //   });
      //   return;
      // }
      if (this.coin_num == "") {
        this.$Notice.error({
          title: "请输入提币数量"
        });
        return;
      }
      if (Number(this.coin_num) < Number(this.out_fee)) {
        this.$Notice.error({
          title: `提币数量需大于 ${this.out_fee} MBB`
        });
        return;
      }
      if (Number(this.coin_num) < Number(this.out_min)) {
        this.$Notice.error({
          title: `最少需提${this.out_min}MBB`
        });
        return;
      }
      if (Number(this.coin_num) > Number(this.out_max)) {
        this.$Notice.error({
          title: `单笔最高可提${this.out_max}MBB`
        });
        return;
      }
      if (this.verifyCode == "") {
        this.$Notice.error({
          title: this.yzPlaceholder
        });
        return;
      }
      let res = await coinOut(
        this.$paramMd5([
          `type=${this.type}`,
          `address=${this.address}`,
          `coin_num=${this.coin_num}`,
          `verifyCode=${this.verifyCode}`
        ])
      );
      if (res && res.code == 1) {
        this.$Notice.success({
          title: res.message
        });
        this.verifyCode = "";
        this.userMbb();
        Bus.$emit("RechargeRecord"); //更新提币记录
      } else {
        this.$Notice.error({
          title: res.message
        });
      }
    },
    //可用MBB
    async userMbb(index) {
      let res = await userMbb(this.$paramMd5([]));
      if (res && res.code == 1) {
        this.MbbNum = res.data.data.num;
      } else {
        this.$Notice.error({
          title: res.message
        });
      }
    },
    //可用MBB 我的佣金
    async coinSet(index) {
      let res = await coinSet(this.$paramMd5([]));
      if (res && res.code == 1) {
        let r = res.data.coinInfo;
        this.out_min = r.out_min; //最小
        this.out_max = r.out_max; //最大
        this.out_fee = r.out_fee; //手续费
      } else {
        this.$Notice.error({
          title: res.message
        });
      }
    },
    //提币地址列表
    async getAddrAction(index) {
      let i = index ? index : 1;
      let res = await getAddrAction(this.$paramMd5([]));
      if (res && res.code == 1) {
        this.addreessList = res.data;
        this.addreessList = this.addreessList.filter(item => {
          return item.title_short == "MBB"; //过滤USDT地址
        });
        this.addList = this.addreessList.map(item => {
          return item.addr;
        });
      } else {
        this.$Notice.error({
          title: res.message
        });
      }
    },
    //获取选中的提币地址
    getAddress(data) {
      this.address = data;
      this.popFlag = false;
    },

    changeNum() {
      if (this.coin_num - 0 > this.MbbNum - 0) {
        this.coin_num = parseInt(this.MbbNum);
      }
    },
    showPop() {
      this.popFlag = true;
    },
    closePop() {
      this.popFlag = false;
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/less/global.less";
@import "../../../assets/less/mixin.less";

.commission {
  padding-top: 20px;
  height: 49%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 1px 0px rgba(6, 0, 1, 0.1);
  border-radius: 10px;
}
.commission {
  h2 {
    margin-left: 20px;
    height: 18px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #1e47a6;
    line-height: 18px;
  }
}
.text_center {
  text-align: center;
}
.text_right {
  text-align: right;
}

.form_wrap {
  padding: 20px 20px 20px 20px;
  .input_wrap {
    display: flex;
    margin-bottom: 20px;
    > p {
      height: 40px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(83, 105, 118, 1);
      line-height: 40px;
      width: 80px;
    }
    > div {
      display: flex;
      justify-content: space-between;
      width: 100%;
      > input {
        width: 100%;
        box-sizing: border-box;
      }

      > p {
        white-space: nowrap;
        padding: 0 15px;
        min-width: 98px;
        height: 40px;
        background: rgba(0, 185, 159, 1);
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        margin-left: 20px;
        cursor: pointer;
      }
      > div {
        white-space: nowrap;
        text-align: left;
        line-height: 20px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #333;
        margin-left: 20px;
        cursor: pointer;
        .red {
          color: #e02020;
        }
      }
    }
  }
}

.shade {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: black;
  opacity: 0.3;
  z-index: 9;
}
.pop {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  width: 580px;
  height: 430px;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  box-shadow: 1px 1px 1px 0px rgba(6, 0, 1, 0.1);
  z-index: 999;
  > h2 {
    text-align: center;
    height: 16px;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(78, 98, 113, 1);
    line-height: 16px;
  }
  .close {
    height: 50px;
    padding-top: 20px;
    box-sizing: border-box;
    > .icon-close {
      float: right;
      margin-right: 20px;
      display: inline-block;
      margin: 0 10px 0 0;
      width: 15px;
      height: 15px;
      overflow: hidden;
      vertical-align: middle;
      margin-top: -2px;
      background-size: 100%;
      background-repeat: no-repeat;
      cursor: pointer;
      .bg-image("../img/guanbi");
    }
  }
  .input_wrap {
    width: 500px;
    margin: 40px;
    height: 40px;
    display: flex;
    > p {
      width: 80px;
      height: 40px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      line-height: 40px;
    }
    > input,
    > .ivu-select {
      width: 420px;
      height: 40px;
      border: none;
      border: 1px solid rgba(83, 105, 118, 1);
      font-size: 14px;
      font-family: Source Han Sans CN;
      padding-left: 15px;
      font-weight: bold;
      color: rgba(102, 102, 102, 1);
      line-height: 40px;
    }
    > .ivu-select {
      padding-left: 0px;
    }
  }
  .addAddress_sub {
    cursor: pointer;
    width: 500px;
    height: 40px;
    line-height: 40px;
    background: rgba(0, 185, 159, 1);
    text-align: center;
    margin: 40px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
  }
}
</style>
