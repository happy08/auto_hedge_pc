<template>
  <div class="content_box">
    <div class="left">
      <div class="commission">
        <h2>充币</h2>
        <div class="form_wrap">
          <div class="input_wrap">
            <div>
              <input
                type="text"
                readonly
                :value="code"
              />
              <p
                v-clipboard:copy="code"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >复制</p>
            </div>
          </div>
        </div>
        <div class="qrcode">
          <div id="qrcode" class="two-code" ref="qrcode"></div>请勿向此地址充值任何非
          <span class="red">MBB</span>资产
          <br />否则资产将丢失无法找回
        </div>
      </div>
      <record :type='1'></record>
    </div>
    <div class="right">
      <recharge></recharge>
      <record :type='2'></record>
    </div>
  </div>
</template>
<script>
import util from "../../utils/util";
import { coinIn } from "../../service/api.js"; //接口

import Recharge from "../component/MBBRecharge/Recharge";
import Record from "../component/MBBRecharge/Record"; //充提记录 type 0 全部 1 充币 2 提币
import QRCode from "qrcodejs2";

export default {
  components: {
    Recharge,
    Record
  },
  data() {
    return {
      code: null
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    async init() {
      let res = await coinIn(this.$paramMd5([]));
      if (res && res.code == 1) {
        //console.log('res',res);
        this.code = res.data.address ;
        this.getQrcode();
      } else {
        window.warn(res.message);
      }
    },
    qrcode() {
      let qrcode = new QRCode("qrcode", {
        width: 120,
        height: 120,
        text: this.code
      });
    },
    getQrcode() {
      this.$nextTick(() => {
        this.qrcode();
      });
    },
    onCopy() {
      window.success("复制成功");
    },
    // 复制失败
    onError() {
      window.success("复制失败");
    }
  }
};
</script>
<style lang="less" scoped>
.red {
  color: #e02020;
}
.commission {
  padding-top: 20px;
  background: #ffffff;
  box-shadow: 1px 1px 1px 0px rgba(6, 0, 1, 0.1);
  border-radius: 10px;
  height: 49%;
}

.table_wrap {
  // width: 420px;
  height: calc(100% - 95px);
  overflow-y: scroll;
}

.content_box {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}
.qrcode {
  font-size: 16px;
  text-align: center;
  .two-code {
    width: 120px;
    margin: 0 auto 20px auto;
  }
}

.left > h2,
.right > h2 {
  margin-top: 20px;
  margin-left: 20px;
  height: 18px;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #1E47A6;
  line-height: 18px;
}
.commission {
  background: rgba(255, 255, 255, 1);
  padding-top: 20px;
}
.commission h2 {
  margin-left: 20px;
  height: 18px;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #1E47A6;
  line-height: 18px;
}
.text_center {
  text-align: center;
}
.text_right {
  text-align: right;
}
.left {
  flex: 1;
  height: 100%;
  // background: rgba(255, 255, 255, 1);
  // box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
  // border-radius: 10px;
}
.right {
  flex: 1;
  height: 100%;
  // overflow-y: scroll;
  margin-left: 20px;
  width: 100%;
  // background: rgba(255, 255, 255, 1);
  // box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
  // border-radius: 10px;
}

.form_wrap {
  padding: 20px 20px 10px 20px;
  .input_wrap {
    display: flex;
    margin-bottom: 20px;
    > div {
      display: flex;
      justify-content: space-between;
      width: 100%;
      > input {
        width: 100%;
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
    }
  }
}

</style>
