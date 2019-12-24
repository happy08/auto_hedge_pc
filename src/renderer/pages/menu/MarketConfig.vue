<template>
  <div class="content_box">
    <Spin fix v-if="showSpin"></Spin>
    <div class="left">
      <h2>市场名</h2>
      <div class="selectNetwork">
        <div :class="{active: selected==2 }" @click="selectItem(2)">比特儿</div>
        <div :class="{active: selected==1 }" @click="selectItem(1)">中币网</div>
        <div :class="{active: selected==3 }" @click="selectItem(3)">OKEx</div>
      </div>
      <div class="recommendNet">
        <p>推荐官网:</p>
        <p v-if=" selected &&selected==1">https://www.zb.live</p>
        <p v-else-if="selected &&selected==2">https://gateio.org/</p>
        <p v-else-if="selected &&selected==3">https://www.okex.me</p>
      </div>
      <div class="api_setting">
        <p>API设置</p>
        <div class="input_wrap">
          <p>AccessKey:</p>
          <input v-model="accesskey" type="text" />
        </div>
        <div class="input_wrap">
          <p>SecretKey:</p>
          <input v-model="secretkey" type="text" />
        </div>
        <div class="input_wrap" v-if="selected &&selected==3">
          <p>密码:</p>
          <input v-model="pwd" type="text" />
        </div>
        <div class="btn_wrap">
          <p @click="testAPI">{{btnText}}</p>
          <p @click="saveAPI">保存</p>
        </div>
      </div>
    </div>
    <div class="right">
      <div v-if=" selected &&selected==1" class="introduction_text">
        <p>API配置说明</p>
        <div class="img_wrap">
          <p>1、登录中币网，如未进行谷歌认证请先按中币网的说明下载zb身份验证器进行验证；</p>
          <p>2、点击账号管理—API设置;</p>
          <img src="../../assets/img/configText1.png" alt />
        </div>
        <div class="img_wrap">
          <p>3、设置备注名，打开zb身份验证器获取谷歌验证码;</p>
          <img src="../../assets/img/configText2.png" alt />
        </div>
        <div class="img_wrap">
          <p>4、生成成功，复制Access Key、Secret Key;</p>
          <img src="../../assets/img/configText3.png" alt />
        </div>
      </div>
      <div v-if=" selected &&selected==2" class="introduction_text">
        <p>API配置说明</p>
        <div class="img_wrap">
          <p>1、登录比特儿；</p>
          <p>2、进入账号管理-安全设置-APIKeys;</p>
          <img src="../../assets/img/gate_1@2x.png" alt />
        </div>
        <div class="img_wrap">
          <p>3、选择现货APIKeys,输入资金密码，点击获取验证码;</p>
          <img src="../../assets/img/gate_3@2x.png" alt />
        </div>
        <div class="img_wrap">
          <p>4、生成成功，复制Key、Secret</p>
          <img src="../../assets/img/gate_3@2x.png" alt />
        </div>
      </div>
      <div v-if=" selected &&selected==3" class="introduction_text">
        <p>API配置说明</p>
        <div class="img_wrap">
          <p>1、登录OKEx，点击账号管理——API管理；</p>
          <img src="../../assets/img/okex_1.png" alt />
        </div>
        <div class="img_wrap">
          <p>2、选择V3 API</p>
          <img src="../../assets/img/okex_2.png" alt />
        </div>
        <div class="img_wrap">
          <p>3、设置备注名、密码及交易权限，获取短信验证码；点击确认；</p>
          <img src="../../assets/img/okex_3.png" alt />
        </div>
        <div class="img_wrap">
          <p>4、选择所创建的API点击查看；</p>
          <img src="../../assets/img/okex_4.png" alt />
        </div>
        <div class="img_wrap">
          <p>5、输入创建时设置的密码，获取短信验证码点击确认；</p>
          <img src="../../assets/img/okex_5.png" alt />
        </div>
        <div class="img_wrap">
          <p>6、获取APIkey，secretKey；</p>
          <img src="../../assets/img/okex_6.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from "../../utils/util";
import Bus from '@/utils/bus'
import {
  swithStatus,
  testExchangeAPI,
  exchangeAPIList,
  exchangeAPIListAddOrUpdate,
  exchange,
  exchangeAdd,
  openMain,
  exchangeAPIListAdd
} from "../../controller/common";
import { main } from "../../controller/main";
export default {
  data() {
    return {
      APIarr: [],
      accesskey: "",
      secretkey: "",
      selected: 1,
      exchanges: [],
      user_id: "",
      mainStatus: "",
      pwd: "",
      notification: true,
      notificationExchange: "",
      showSpin: false,
      btnText: '测试网络',
    };
  },
  computed: {},
  created() {
    //创建时 新增交易所
    this.init();
    this.selectItem(2);
  },
  methods: {
    async init() {
      let status = await swithStatus();
      if (status == "close") {
        this.mainStatus = 1;
      } else {
        this.mainStatus = 2;
      }
    },
    async insertExchange(data) {
      //初始化交易所
      let data1 = {
        name: "中币网",
        rest_host: "http://api.zb.live/data",
        rest_trade_host: "https://trade.zb.live/api",
        websocket_host: "wss://api.zb.live/websocket"
      };
      let data2 = {
        name: "比特儿",
        rest_host: "https://data.gateio.life/api",
        rest_trade_host: "https://api.gateio.life/api",
        websocket_host: "wss://fx-ws.gateio.ws/v4/ws"
      };
      let data3 = {
        name: "OKEx",
        rest_host: "https://www.okex.me",
        rest_trade_host: "https://www.okex.me",
        websocket_host: "wss://real.okex.me:8443/ws/v3"
      };
      let res1 = await exchangeAdd(data1);
      let res2 = await exchangeAdd(data2);
      let res3 = await exchangeAdd(data3);
      this.exchanges = await exchange();
    },
    async testAPI() {
      let exchangeName = {
        1: "中币网",
        2: "比特儿",
        3: "OKEx"
      };
      if (!this.accesskey) {
        window.warn(`${this.notificationExchange} AccessKey为空!`);
        return;
      }
      if (!this.secretkey) {
        window.warn(`${this.notificationExchange} SecretKey为空!`);
        return;
      }
      if(this.selected ==3 && !this.pwd){
         window.warn(`${this.notificationExchange} 密码为空!`);
         return;
      }
      if (!this.accesskey || !this.secretkey || (this.selected ==3 && !this.pwd)) {
        return;
      }
       let status = await swithStatus();
      if (status == "close") {
        this.mainStatus = 1;
      } else {
        window.warn("对冲程序正在运行，请停止后再测试!");
        return;
      }
      if (!this.notification) {
        window.warn(`${this.notificationExchange} API正在测试中，请稍后!`);
        return;
      }
      this.btnText = `测试中`;
      this.notification = false;
      this.notificationExchange = exchangeName[this.selected];
      window.success(`${this.notificationExchange} API开始测试!`);
      let user_id = this.$getUserInfo() ? this.$getUserInfo().id : "";
      let data = {
        id: this.selected,
        key: this.accesskey,
        secret: this.secretkey,
        test: 1,
        pwd: this.pwd,
        user_id: user_id
      };
   
      // Bus.$emit("logout",'API测试中...') 
      let res = await testExchangeAPI(data);

      res ? window.success(`${this.notificationExchange} API测试通过`): window.warn(`${this.notificationExchange} API测试未通过`);
      // Bus.$emit("logoutEnd") 
      this.btnText = '测试网络'
      this.notification = true;
    },
    async getAPIs() {
      await this.insertExchange();
      let user_id = this.$getUserInfo().id;
      if (!user_id) {
        return;
      }
      let data = {
        user_id: user_id
      };

      let APIarr = [
        {
          user_id: user_id,
          exchange_id: 1,
          exchange_name: "中币网",
          key: "",
          secret: "",
          sync: 0
        },
        {
          user_id: user_id,
          exchange_id: 2,
          exchange_name: "比特儿",
          key: "",
          secret: "",
          sync: 0
        },
        {
          user_id: user_id,
          exchange_id: 3,
          exchange_name: "OKEx",
          key: "",
          secret: "",
          sync: 0
        }
      ];
      await exchangeAPIListAdd(APIarr[0]);
      await exchangeAPIListAdd(APIarr[1]);
      await exchangeAPIListAdd(APIarr[2]);
      APIarr = await exchangeAPIList(data);
      //console.log(APIarr);

      this.APIarr = APIarr;
    },
    async saveAPI() {
      let status = await swithStatus();
      if (status == "close") {
        this.mainStatus = 1;
      } else {
        window.warn("对冲程序正在运行，请停止后再保存!");
        return;
      }

      if (!this.accesskey) {
        window.warn("请填写Accesskey");
        return;
      }
      if (!this.secretkey) {
        window.warn("请填写Secretkey");
        return;
      }
      if (this.selected == 3 && !this.pwd) {
        window.warn("请填写密码");
        return;
      }
      let user_id = this.$getUserInfo() ? this.$getUserInfo().id : 0;
      let data = {
        user_id: user_id,
        exchange_id: 1,
        exchange_name: "中币网",
        key: this.accesskey,
        secret: this.secretkey,
        sync: 0
      };
      if (this.selected == 2) {
        data.exchange_id = 2;
        data.exchange_name = "比特儿";
      }
      if (this.selected == 3) {
        data.exchange_id = 3;
        data.exchange_name = "OKEx";
        data.pwd = this.pwd;
      }

      await exchangeAPIListAddOrUpdate(data).then(res => {
        if (res) {
          window.success("保存成功");
        }
      });
    },
    async selectItem(n) {
      this.selected = n;
      //数据库查找
      await this.getAPIs();
      //console.log("APIarr", this.APIarr);
      this.APIarr.forEach(element => {
        if (
          (n == 1 && element.exchange_name == "中币网") ||
          (n == 2 && element.exchange_name == "比特儿") ||
          (n == 3 && element.exchange_name == "OKEx")
        ) {
          this.accesskey = element.key;
          this.secretkey = element.secret;
          if (n == 3 && element.exchange_name == "OKEx") {
            this.pwd = element.pwd;
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.content_box {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
}
.left {
  width: 460px;
  max-width: 460px;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
  border-radius: 10px;
  h2 {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    height: 18px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #1E47A6;
    line-height: 18px;
  }
}
.right {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin-left: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
  border-radius: 10px;
}
.main {
  max-height: 2000px;
  background: burlywood;
}
.selectNetwork {
  margin: 13px 0 0 20px;
  display: flex;
  div {
    width: 60px;
    height: 30px;
    border: 1px solid rgba(0, 185, 159, 1);
    box-sizing: border-box;
    text-align: center;
    font-size: 14px;
    line-height: 30px;
    cursor: pointer;
    &.active {
      background: rgba(0, 185, 159, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
  > div:nth-child(1) {
    margin-right: 20px;
  }
  > div:nth-child(2) {
    margin-right: 20px;
  }
}
.recommendNet {
  margin: 30px 0 0 20px;
  display: flex;
  > p:nth-child(1) {
    height: 16px;
    font-size: 12px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 16px;
    padding-right: 30px;
  }
  > p:nth-child(2) {
    height: 15px;
    font-size: 12px;
    font-weight: bold;
    color: #1E47A6;
    line-height: 16px;
    padding-right: 30px;
  }
  > p:nth-child(3) {
    height: 15px;
    font-size: 12px;
    font-weight: bold;
    color: #1E47A6;
    line-height: 16px;
  }
}
.api_setting {
  margin: 30px 20px 0 20px;
  > p {
    height: 16px;
    font-size: 12px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 16px;
    padding-right: 30px;
  }
}
.input_wrap {
  display: flex;
  padding-left: 20px;
  margin-top: 20px;
  > p {
    width: 80px;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    text-align: right;
    padding-right: 20px;
  }
  > input {
    width: 250px;
    font-size: 12px;
  }
}
.btn_wrap {
  padding-left: 100px;
  display: flex;
  margin-top: 30px;
  p {
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: rgba(0, 185, 159, 1);
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(254, 255, 255, 1);
    cursor: pointer;
  }
  p:nth-child(1) {
    width: 120px;

    margin-right: 30px;
  }
  p:nth-child(2) {
    width: 100px;
  }
}
.introduction_text {
  padding: 20px 20px 17px 20px;
  > p {
    height: 16px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 16px;
  }
  .img_wrap {
    padding: 10px 20px 0px 10px;
    p {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(78, 98, 113, 1);
    }
    img {
      margin-top: 10px;
      // max-width: 1000px;
      width: 100%;
      margin-right: 20px;
    }
  }
}
</style>
