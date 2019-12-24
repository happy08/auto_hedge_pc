<template>
  <div class="commission">
    <h2>佣金提币</h2>
    <div class="form_wrap">
      <!-- <div class="input_wrap">
        <p>地址名称</p>
        <div>
          <input type="text" placeholder="请输入十个中文字符长度以内的名称" maxlength="10" v-model="addressName" />
        </div>
      </div>-->
      <div class="input_wrap">
        <p>提币地址</p>
        <div>
          <input type="text" placeholder="输入USDT钱包地址，输入错误会使您丢失数字资产" v-model="zc_addr" />
        </div>
      </div>
      <div class="input_wrap">
        <p>提币数量</p>
        <div>
          <input
            type="number"
            min="0"
            :placeholder="'当前可提'+usdtBalance+'USDT'"
            v-model="zc_num"
            @input="changeNum"
            onkeyup="this.value=this.value.replace(/^![1-9]\d*(\.\d+)?$/,'')"
          />
          <p>提币手续费 {{usdt_fee}} USDT</p>
        </div>
      </div>
      <div class="input_wrap">
        <p>验证码</p>
        <div>
          <input
            type="text"
            class="yanzhen"
            maxlength="6"
            v-model="verifyCode"
            :placeholder="yzPlaceholder"
          />
          <send-sms-or-email :type="2"></send-sms-or-email>

          <!-- <p v-show="!msmFlag">{{wait_timer}}S</p>
          <p v-show="msmFlag" @click="sendMsg">{{send}}</p>-->
        </div>
      </div>
      <div class="input_wrap">
        <p style="visibility:hidden">提交</p>
        <div>
          <a class="submitBtn" @click="submitBtn">提交</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import sendSmsOrEmail from "../sendSmsOrEmail";
import { floatAdd, floatDiv, floatSub, floatMul } from "../../../utils/common";

import {
  sendSms,
  addMentionMoneyLog,
  getTraderLog,
  coinSet
} from "../../../service/api.js"; //接口
import Bus from "@/utils/bus";
export default {
  name: "commissionMoney",
  data() {
    return {
      verifyCode: "",
      phone: "",
      addressName: "",
      zc_addr: "", //提币地址
      usdt_fee: "", //提币手续费
      zc_num: "", //提币数量
      usdtBalance: "",
      type: "", //1手机 2邮箱

      userInfo: "",
      yzPlaceholder: ""
    };
  },
  components: {
    sendSmsOrEmail
  },
  created() {
    //this.phone = this.$getUserInfo().phone;
    this._getTraderLog(1);
    this.coinSet();
    this.userInfo = this.$getUserInfo();
  },
  computed: {
    //手续费计算
    // usdt_fee_real(){
    //   return  this.usdt_fee&&this.zc_num?floatMul(floatDiv(Number(this.usdt_fee),100),Number(this.zc_num)):0
    // }
  },
  watch: {
    userInfo() {
      if (this.userInfo.phone != "" && this.userInfo.phone !== undefined) {
        this.type=1
        this.yzPlaceholder = "请输入手机验证码";
      } else {
        this.type=2
        this.yzPlaceholder = "请输入邮箱验证码";
      }
    }
  },

  methods: {
    async submitBtn() {
      // if ((this.addressName = "")) {
      //   this.$Notice.error({
      //     title: "请输入提币地址名称"
      //   });
      //   return;
      // }
      if (this.zc_addr == "") {
        this.$Notice.error({
          title: "请输入提币地址"
        });
        return;
      }
      if (this.zc_num == "") {
        this.$Notice.error({
          title: "请输入提币数量"
        });
        return;
      }
      if (Number(this.zc_num) < Number(this.usdt_fee)) {
        this.$Notice.error({
          title: `提币数量不能小于手续费`
        });
        return;
      }
      if (this.verifyCode == "") {
        this.$Notice.error({
          title: this.yzPlaceholder
        });
        return;
      }
      let res = await addMentionMoneyLog(
        this.$paramMd5([
          `type=${this.type}`,
          `zc_addr=${this.zc_addr}`,
          `zc_num=${this.zc_num}`,
          `verifyCode=${this.verifyCode}`
        ])
      );
      if (res && res.code == 1) {
        this.$Notice.success({
          title: res.message
        });
        this._getTraderLog();
        this.verifyCode = "";
        Bus.$emit("TraderLog");
      } else {
        this.$Notice.error({
          title: res.message
        });
      }
    },
    //我的佣金
    async _getTraderLog(index) {
      let res = await getTraderLog(
        this.$paramMd5([`page=${index}`, `limit=${this.limit}`])
      );
      if (res && res.code == 1) {
        this.usdtBalance = res.data.usdt;
      } else {
        this.$Notice.error({
          title: res.message
        });
      }
    },
    //手续费
    async coinSet() {
      let res = await coinSet(this.$paramMd5([]));
      if (res && res.code == 1) {
        this.usdt_fee = res.data.coinInfo.usdt_fee; //提币手续费
      } else {
        this.$Notice.error({
          title: res.message
        });
      }
    },

    changeNum() {
      if (this.zc_num - 0 > this.usdtBalance - 0) {
        this.zc_num = this.usdtBalance;
      }
    }
  }
};
</script>
<style lang="less" scoped>
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
        height: 40px;
        background: #e3f8fe;
        border: none;
        padding-left: 15px;
        box-sizing: border-box;
      }

      > p {
        white-space: nowrap;
        padding: 0 15px;
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
      .yanzhen {
        // width: 180px !important;
      }
    }
  }
}
</style>
