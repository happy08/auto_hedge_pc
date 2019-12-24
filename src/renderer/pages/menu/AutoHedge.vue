<template>
  <div class="content_box">
    <div class="shade" @click="closePop" v-show="popFlag"></div>
    <div class="left">
      <h2>市场消息</h2>
      <div class="table_wrap" v-if="nowInfo && nowInfo.length">
        <div class="table_t">
          <p class="text_center">交易对</p>
          <p class="text_center">交易市场</p>
          <p class="text_center">即时消息</p>
        </div>
        <div
          class="table_l"
          :class="{none:item&&item.msg =='-'}"
          v-for="(item,index) in nowInfo"
          :key="index">
          <div class="text_center">{{item.pair}}</div>
          <div class="text_center">{{item.exchange}}</div>
          <div
            class="text_center"
            style
            :class="{addcolor:item.msg=='未读取到资产，请到交易所补充',addcolor2:item.msg!='未读取到资产，请到交易所补充'&&item.msg!='连接中'}"
          >{{item.msg}}</div>
        </div>
      </div>
    </div>
    <div class="right">
      <h2>对冲记录</h2>
      <div class="hedge_wrap">
        <div class="hedge_btn">
          <div @click="hedgeSwitch" :class="{open: mainSwitch=='开始对冲' }">{{mainSwitch}}</div>
          <div @click="showPop">配置策略</div>
          <!-- <div @click="exportData">导出日志</div>
          <span style='font-size:12px;' v-if="dir">日志路径：{{dir}}</span> -->
        </div>
        <div class="condition">
          <div class="item">
            <p>币种：</p>
            <Select v-model="coinSelected" size="large">
              <Option
                v-for="item in coinList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="item">
            <p>状态：</p>
            <Select v-model="StatusSelected" size="large">
              <Option
                v-for="item in statusList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="item">
            <p>日期：</p>
            <DatePicker
              type="daterange"
              ref="element"
              show-week-numbers
              placement="bottom-end"
              placeholder="请选择日期"
              :value="dateValue"
              @on-change="handleChange"
            ></DatePicker>
          </div>
          <div class="item">
            <div @click="clear" class="btn-clear">清空</div>
            <div @click="query(1)" class="btn-query">查询</div>
          </div>
        </div>
      </div>
      <p>*注：绿色字体为状态为执行中的挂单</p>
      <div class="tab_wrap" v-if="orderLists && orderLists.length>0">
        <div class="table_t">
          <div>交易对</div>
          <div style="flex:3;">买入/卖出</div>
          <div>收益率</div>
          <div>时间</div>
          <div>挂单量</div>
          <div style="flex:3;">成交量</div>
        </div>
        <div class="table_l_wrapper">
          <div
            class="table_l"
            :class="{green:item.status && item.status==1}"
            v-for="(item,index) in orderLists"
            :key="index"
          >
            <div>{{item.uniform}}</div>
            <div style="flex:3;">
              <!-- <div class="top">{{item.buy_exchange}}/</div>
              <div class="top">{{item.sell_exchange}}</div>-->
              {{`${item.buy_exchange}/${item.sell_exchange}`}}
            </div>
            <div>{{item.income_rate?Number(item.income_rate).toFixed(5):0}}%</div>
            <div>{{item.time_create | dateFilter}}</div>
            <div>{{item.amount}}</div>
            <div
              style="flex:3;"
            >{{`${item.buy_turnover?item.buy_turnover:0}/${item.sell_turnover?item.sell_turnover:0}`}}</div>
          </div>
        </div>
      </div>
      <div v-if="orderLists && orderLists.length>0" class="pagetion">
        <Page
          :current="current"
          :total="total"
          :page-size="limit"
          show-elevator
          @on-change="pageEvent"
        ></Page>
      </div>
    </div>
    <div class="pop middle" v-show="popFlag">
      <i @click="closePop" class="icon-close"></i>
      <h2>策略设置</h2>
      <div class="setting_wrap">
        <div class="market">
          <p>交易市场:</p>
          <div class="listItem">
            <a
              class="item"
              :class="{selected: listMarket[index].check }"
              v-for="(item, index) in listMarket"
              :key="index"
              @click="selectedMItem(index)"
            >
              <i class="icon-checkbox" :class="{checked: listMarket[index].check }"></i>
              {{item.label}}
            </a>
          </div>
        </div>
        <div class="market">
          <p>对冲币种:</p>
          <div class="listItem">
            <a
              class="item"
              :class="{selected: listCoin[index].check }"
              v-for="(item, index) in listCoin"
              :key="index"
              @click="selectedCItem(index)"
            >
              <i class="icon-checkbox" :class="{checked: listCoin[index].check }"></i>
              {{item.label}}
            </a>
          </div>
        </div>
        <div class="market">
          <p>货币单位:</p>
          <div class="listItem">
            <a
              class="item"
              :class="{selected: listUnit[index].check }"
              v-for="(item, index) in listUnit"
              :key="index"
              @click="selectedUItem(index)"
            >
              <i class="icon-checkbox" :class="{checked: listUnit[index].check }"></i>
              {{item.label}}
            </a>
          </div>
        </div>
         <div class="market">
          <p>对冲差价:</p>
          <div class="listItem">
            <a
              class="item"
              :class="{selected: listSpread[index].check }"
              v-for="(item, index) in listSpread"
              :key="index"
              @click="selectedSItem(index)"
            >
              <i class="icon-checkbox" :class="{checked: listSpread[index].check }"></i>
              {{item.label}}
            </a>
          </div>
        </div>
        <div class="tip">
          <span class="leftItem">
              对冲价差=（B交易所买一价-A交易所卖一价）/（B交易所买一价+A交易所卖一价）
          </span>
          <span class="rightItem">
              价差≤0.3%有亏损风险！
          </span>
        </div>
        <div class="divi"></div>
        <div class="list">
          <p>对冲市场:</p>
          <div class="tab_wrap">
            <div class="table_t">
              <p>交易对</p>
              <p style="text-align:center;flex=1">交易市场</p>
              <p style="text-align:right;flex=1">启用状态</p>
            </div>
            <div class="table_l" v-for="(item,index) in selectedItem" :key="index">
              <p>{{item.pair}}</p>
              <p style="text-align:center;">{{item.market}}</p>
              <p style="text-align:right;" @click="clickSwitch(item)">
                <i-switch v-model="item.switch" size="large"></i-switch>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from "../../utils/util";
import Bus from "../../utils/bus";
import { uploadTradeMsg, getUserInfo } from "../../service/api";
import {
  min,
  floatAdd,
  floatDiv,
  floatSub,
  floatMul,
  paramMd5
} from "@/utils/common";
import {
  swithStatus,
  openMain,
  closeMain,
  tradeConfigList,
  tradeConfigListAddOrUpdate,
  tradeConfigListClear,
  orderList,
  exportExcel
} from "../../controller/common";
import { sleep } from "../../utils/common";
import { main } from "../../controller/main";
const { ipcRenderer } = require("electron");

export default {
  data() {
    return {
      total: 0,
      limit: 10,
      is_real: 1,
      current: 1,
      mainSwitch: "",
      popFlag: false,
      coinSelected: 3,
      StatusSelected: 3,
      dateSelected: "",
      dateValue: "",
      statusList: [
        {
          value: 3,
          label: "全部"
        },
        {
          value: 1,
          label: "进行中"
        },
        {
          value: 0,
          label: "已结束"
        },
        {
          value: 2,
          label: "失败"
        }
      ],
      coinList: [
        {
          value: 3,
          label: "全部"
        },
        {
          value: "BTC",
          label: "BTC"
        },
        {
          value: "ETH",
          label: "ETH"
        },
        {
          value: "ETC",
          label: "ETC"
        },
        {
          value: "LTC",
          label: "LTC"
        },
        {
          value: "EOS",
          label: "EOS"
        }
      ],
      listMarket: [
        {
          check:
            localStorage["selectM" + "中币网"] != "undefined" &&
            localStorage["selectM" + "中币网"] == "1"
              ? true
              : false,
          label: "中币网"
        },
        {
          check:
            localStorage["selectM" + "比特儿"] != "undefined" &&
            localStorage["selectM" + "比特儿"] == "1"
              ? true
              : false,
          label: "比特儿"
        },
        {
          check:
            localStorage["selectM" + "OKEx"] != "undefined" &&
            localStorage["selectM" + "OKEx"] == "1"
              ? true
              : false,
          label: "OKEx"
        }
      ],
      listCoin: [
        {
          check:
            localStorage["selectC" + "BTC"] != "undefined" &&
            localStorage["selectC" + "BTC"] == "1"
              ? true
              : false,
          label: "BTC"
        },
        {
          check:
            localStorage["selectC" + "ETH"] != "undefined" &&
            localStorage["selectC" + "ETH"] == "1"
              ? true
              : false,
          label: "ETH"
        },
        {
          check:
            localStorage["selectC" + "ETC"] != "undefined" &&
            localStorage["selectC" + "ETC"] == "1"
              ? true
              : false,
          label: "ETC"
        },
        {
          check:
            localStorage["selectC" + "LTC"] != "undefined" &&
            localStorage["selectC" + "LTC"] == "1"
              ? true
              : false,
          label: "LTC"
        },
        {
          check:
            localStorage["selectC" + "EOS"] != "undefined" &&
            localStorage["selectC" + "EOS"] == "1"
              ? true
              : false,
          label: "EOS"
        }
      ],
      listUnit: [
        {
          check:
            localStorage["selectU" + "USDT"] != "undefined" &&
            localStorage["selectU" + "USDT"] == "1"
              ? true
              : false,
          label: "USDT"
        }
      ],
      listSpread: [
        {
          check:
            localStorage["selectS" + "0.2%"] != "undefined" &&
            localStorage["selectS" + "0.2%"] == "1"
              ? true
              : false,
          label: "0.2%"
        },
         {
          check:
            localStorage["selectS" + "0.3%"] != "undefined" &&
            localStorage["selectS" + "0.3%"] == "1"
              ? true
              : false,
          label: "0.3%"
        },
         {
          check:
            localStorage["selectS" + "0.4%"] != "undefined" &&
            localStorage["selectS" + "0.4%"] == "1"
              ? true
              : false,
          label: "0.4%"
        },
         {
          check:
            localStorage["selectS" + "0.5%"] != "undefined" &&
            localStorage["selectS" + "0.5%"] == "1"
              ? true
              : false,
          label: "0.5%"
        },
      ],
      selectedItem: "",
      nowInfo: [
        {
          pair: "BTC/USDT",
          exchange: "中币网",
          msg: "-"
        },
        {
          pair: "BTC/USDT",
          exchange: "比特儿",
          msg: "-"
        },
        {
          pair: "BTC/USDT",
          exchange: "OKEx",
          msg: "-"
        },
        {
          pair: "ETH/USDT",
          exchange: "中币网",
          msg: "-"
        },
        {
          pair: "ETH/USDT",
          exchange: "比特儿",
          msg: "-"
        },
        {
          pair: "ETH/USDT",
          exchange: "OKEx",
          msg: "-"
        },
        {
          pair: "ETC/USDT",
          exchange: "中币网",
          msg: "-"
        },
        {
          pair: "ETC/USDT",
          exchange: "比特儿",
          msg: "-"
        },
        {
          pair: "ETC/USDT",
          exchange: "OKEx",
          msg: "-"
        },
        {
          pair: "LTC/USDT",
          exchange: "中币网",
          msg: "-"
        },
        {
          pair: "LTC/USDT",
          exchange: "比特儿",
          msg: "-"
        },
        {
          pair: "LTC/USDT",
          exchange: "OKEx",
          msg: "-"
        },
        {
          pair: "EOS/USDT",
          exchange: "中币网",
          msg: "-"
        },
        {
          pair: "EOS/USDT",
          exchange: "比特儿",
          msg: "-"
        },
        {
          pair: "EOS/USDT",
          exchange: "OKEx",
          msg: "-"
        }
      ],
      direct: {
        "BTC/USDT中币网": 0,
        "BTC/USDT比特儿": 1,
        "BTC/USDTOKEx": 2,
        "ETH/USDT中币网": 3,
        "ETH/USDT比特儿": 4,
        "ETH/USDTOKEx": 5,
        "ETC/USDT中币网": 6,
        "ETC/USDT比特儿": 7,
        "ETC/USDTOKEx": 8,
        "LTC/USDT中币网": 9,
        "LTC/USDT比特儿": 10,
        "LTC/USDTOKEx": 11,
        "EOS/USDT中币网": 12,
        "EOS/USDT比特儿": 13,
        "EOS/USDTOKEx": 14
      },

      nowInfoStore: [],
      orderLists: [],
      timer: null,
      dir: "",
      selectNOM: ""
    };
  },

  computed: {},
  created() {
    this.query(1);
    // this.checkReady();
    this.init();
    let _this = this;

    let mainCheck = localStorage["mainCheck"];
    mainCheck = mainCheck != "undefined" && mainCheck == "1" ? true : false;
    _this.mainSwitch = mainCheck ? "停止对冲" : "开始对冲";

    ipcRenderer.on("mainCheckMsg", (ev, message) => {
      let mainCheck = localStorage["mainCheck"];
      mainCheck = mainCheck != "undefined" && mainCheck == "1" ? true : false;
      _this.mainSwitch = mainCheck ? "停止对冲" : "开始对冲";
      if (mainCheck == "0") {
        _this.nowInfo = [
          {
            pair: "BTC/USDT",
            exchange: "中币网",
            msg: "-"
          },
          {
            pair: "BTC/USDT",
            exchange: "比特儿",
            msg: "-"
          },
          {
            pair: "BTC/USDT",
            exchange: "OKEx",
            msg: "-"
          },
          {
            pair: "ETH/USDT",
            exchange: "中币网",
            msg: "-"
          },
          {
            pair: "ETH/USDT",
            exchange: "比特儿",
            msg: "-"
          },
          {
            pair: "ETH/USDT",
            exchange: "OKEx",
            msg: "-"
          },
          {
            pair: "ETC/USDT",
            exchange: "中币网",
            msg: "-"
          },
          {
            pair: "ETC/USDT",
            exchange: "比特儿",
            msg: "-"
          },
          {
            pair: "ETC/USDT",
            exchange: "OKEx",
            msg: "-"
          },
          {
            pair: "LTC/USDT",
            exchange: "中币网",
            msg: "-"
          },
          {
            pair: "LTC/USDT",
            exchange: "比特儿",
            msg: "-"
          },
          {
            pair: "LTC/USDT",
            exchange: "OKEx",
            msg: "-"
          },
          {
            pair: "EOS/USDT",
            exchange: "中币网",
            msg: "-"
          },
          {
            pair: "EOS/USDT",
            exchange: "比特儿",
            msg: "-"
          },
          {
            pair: "EOS/USDT",
            exchange: "OKEx",
            msg: "-"
          }
        ];
      }
    });
    ipcRenderer.on("hedgeMsg", async (ev, message) => {
      let status = await swithStatus();
      if ((status && status.length == 0) || (status && status == "close")) {
        return;
      }

      //监听start
      if (
        message &&
        message.exchange.currency_pair &&
        !message.exchange.exchange
      ) {
        let data1 = {
          pair: message.exchange.currency_pair,
          exchange: message.exchange.exchange1,
          msg: message.msg
        };
        let data2 = {
          pair: message.exchange.currency_pair,
          exchange: message.exchange.exchange2,
          msg: message.msg
        };
        let j = _this.direct[`${message.exchange.currency_pair}`];
        _this.nowInfo.splice(j, 1, data1);
        _this.nowInfo.splice(j, 1, data2);

        if (_this.nowInfo.length > 20) {
          _this.nowInfo = [];
        }
      } else if (
        message &&
        message.exchange.pair &&
        message.exchange.exchange
      ) {
        let data = {
          pair: message.exchange.pair,
          exchange: message.exchange.exchange,
          msg: message.msg
        };
        let text = `${message.exchange.pair}${message.exchange.exchange}`;
        let j = _this.direct[text];

        await sleep();
        let selectMarket =
          localStorage["selectMarketNow"] &&
          localStorage["selectMarketNow"] != "undefined"
            ? JSON.parse(localStorage["selectMarketNow"])
            : "";
        // //console.log('selectMarket---',selectMarket,selectMarket.indexOf(message.exchange.exchange));
        if (
          selectMarket &&
          selectMarket.length > 0 &&
          selectMarket.indexOf(message.exchange.exchange) >= 0
        ) {
          _this.nowInfo.splice(j, 1, data);
        }
      }
      let ivuPage = document.getElementsByClassName("ivu-page");
      if (
        ivuPage &&
        ivuPage.length > 0 &&
        ivuPage[0].getElementsByTagName("li") &&
        ivuPage[0].getElementsByTagName("li")[1]
      ) {
        document
          .getElementsByClassName("ivu-page")[0]
          .getElementsByTagName("li")[1]
          .click();
      }
    });
  },
  methods: {
    async _getUserInfo(index) {
      let res = await getUserInfo(this.$paramMd5([]));
      if (res && res.code == 1) {
        return res.data.is_real ? res.data.is_real : 1;
      } else {
        return 1;
      }
      this.showNow = true;
    },
    pageEvent(index) {
      this.query(index);
    },
    async exportData() {
      this.dir = await exportExcel();
    },
    async query(index) {
      index = index ? index : 1;
      let ago =
        this.dateSelected && this.dateSelected.length > 0
          ? new Date(this.dateSelected[1]).getTime()
          : "";
      let later =
        this.dateSelected && this.dateSelected.length > 0
          ? new Date(this.dateSelected[0]).getTime()
          : "";
      let params = {
        type: "query",
        coin: this.coinSelected,
        status: this.StatusSelected,
        ago: ago,
        later: later,
        size: this.limit,
        page: index
      };

      //按照当前条件查询订单
      let lists = await orderList(params);
      if (lists) {
        this.orderLists = lists.data;
        this.total = lists.total ? lists.total.count : 0;
      } else {
        this.orderLists = [];
        this.total = 0;
      }
    },
    async init() {
      let status = await swithStatus();
      if (status == "close") {
        this.mainSwitch = "开始对冲";
      } else {
        this.mainSwitch = "停止对冲";
      }
      //默认选择0.2%
      
      var result = this.listSpread.some((v,i)  =>  {
         return v.check 
      })  
      if(!result){
        this.listSpread[0].check =true
        localStorage["selectS" + "0.2%"] == "1"
      }
    },
    check() {
      let _this = this;
      this.timer = setInterval(() => {
        if (_this.nowInfoStore && _this.nowInfoStore.length > 0) {
          _this.nowInfo.unshift(_this.nowInfoStore.shift());
          if (_this.nowInfo && _this.nowInfo.length > 50) {
            _this.nowInfo = [];
          }
        }
      }, 100);
    },
    async hedgeSwitch() {
      let is_real = await this._getUserInfo();

      let canTry = localStorage["canTry"];
      canTry = JSON.parse(canTry);

      // if (!canTry) {
      //   //console.log("nonono", canTry);
      //   return;
      // }
      //console.log(canTry);
      // 实名状态 1:申请中 2 实名成功 3实名失败
      if (canTry && is_real && is_real != 2) {
        window.warn("请先实名认证");
        return;
      }
      let res;
      if (this.mainSwitch == "停止对冲") {
        res = await closeMain();
        localStorage["mainCheck"] = "0";
        ipcRenderer.send("mainCheck", "msg");
        if (res) {
          this.mainSwitch = "开始对冲";
        }
      } else {
        await this.checkReady();
        res = await openMain();
        localStorage["mainCheck"] = "1";
        if (res) {
          await swithStatus();

          let user_id = this.$getUserInfo() ? this.$getUserInfo().id : 0;
          main(user_id);

          this.mainSwitch = "停止对冲";
        }
      }
    },

    closePop() {
      this.popFlag = false;
    },
    async showPop() {
      let status = await swithStatus();
      if (status == "close") {
        await this.checkReady();
        this.popFlag = true;
      } else {
        window.warn("如需改变策略请先停止对冲");
      }
    },
    async selectedMItem(idx) {
      var check = this.listMarket[idx].check;
      this.listMarket[idx].check = check === true ? false : true;
      localStorage["selectM" + this.listMarket[idx].label] = this.listMarket[idx].check
        ? "1"
        : "0";
      await this.checkReady();
    },
    async selectedCItem(idx) {
      var check = this.listCoin[idx].check;
      this.listCoin[idx].check = check === true ? false : true;
      localStorage["selectC" + this.listCoin[idx].label] = this.listCoin[idx].check
        ? "1"
        : "0";
      await this.checkReady();
    },
    async selectedUItem(idx) {
      var check = this.listUnit[idx].check;
      this.listUnit[idx].check = check === true ? false : true;
      localStorage["selectU" + this.listUnit[idx].label] = this.listUnit[idx].check
        ? "1"
        : "0";
      await this.checkReady();
    },
    async selectedSItem(idx) {
      var check = this.listSpread[idx].check;
      this.listSpread.forEach((e,i)=>{

        e.check =false
        localStorage["selectS" + this.listSpread[i].label] = "0";

        if(i == idx){
          e.check =true
          localStorage["selectS" + this.listSpread[idx].label] =   "1"
        }
      })
   
      await this.checkReady();
    },
    change(status) {
      this.$Message.info("开关状态：" + status);
    },
    handleChange(e) {
      this.dateSelected = e;
    },
    closePop() {
      this.popFlag = false;
    },
    list(data) {
      var number = data; //我们操作的数组
      var state = []; //记录状态的数组
      var out = []; //枚举出来答案得到的数组。
      function dfs(step, n) {
        //n，代表取几个数出来。
        var flag = true;
        if (step == n) {
          //判断条件，判断是否取出来了个数。
          //取反看下存不存在
          let check = [state[1], state[0]];

          if (out.indexOf(check.join("/")) < 0) {
            out.push(state.join("/")); //把取出来的数方法数组中
          }

          return 0; //结束循环
        }

        for (var i = 0; i < number.length; i++) {
          //循环数据
          for (var j = 0; j < state.length; j++) {
            //判断时候取出来重复的数。
            if (state[j] == number[i]) {
              flag = false;
              break;
            }
          }
          if (flag) {
            state.push(number[i]); //保存当前环境
            dfs(step + 1, n);
            state.pop(number[i]); //回退到上一层的环境
          }

          flag = true;
        }
      }
      dfs(0, 2);
      return [out];
    },
    listAll(unit, market) {
      let Arr = [];
      let item;
      for (let i = 0; i < unit.length; i++) {
        for (let j = 0; j < market.length; j++) {
          item = market[j] + "/" + unit[i];
          Arr.push(item);
        }
      }
      return Arr;
    },
    doExchange(doubleArrays) {
      var len = doubleArrays.length;
      if (len >= 2) {
        var arr1 = doubleArrays[0];
        var arr2 = doubleArrays[1];
        var len1 = doubleArrays[0].length;
        var len2 = doubleArrays[1].length;
        var newlen = len1 * len2;
        var temp = new Array(newlen);
        var index = 0;
        for (var i = 0; i < len1; i++) {
          for (var j = 0; j < len2; j++) {
            temp[index] = arr1[i] + "," + arr2[j];
            index++;
          }
        }
        var newArray = new Array(len - 1);
        newArray[0] = temp;
        if (len > 2) {
          var _count = 1;
          for (var i = 2; i < len; i++) {
            newArray[_count] = doubleArrays[i];
            _count++;
          }
        }
        return this.doExchange(newArray);
      } else {
        return doubleArrays[0];
      }
    },
    async checkReady() {
      this.nowInfo = [
        {
          pair: "BTC/USDT",
          exchange: "中币网",
          msg: "-"
        },
        {
          pair: "BTC/USDT",
          exchange: "比特儿",
          msg: "-"
        },
        {
          pair: "BTC/USDT",
          exchange: "OKEx",
          msg: "-"
        },
        {
          pair: "ETH/USDT",
          exchange: "中币网",
          msg: "-"
        },
        {
          pair: "ETH/USDT",
          exchange: "比特儿",
          msg: "-"
        },
        {
          pair: "ETH/USDT",
          exchange: "OKEx",
          msg: "-"
        },
        {
          pair: "ETC/USDT",
          exchange: "中币网",
          msg: "-"
        },
        {
          pair: "ETC/USDT",
          exchange: "比特儿",
          msg: "-"
        },
        {
          pair: "ETC/USDT",
          exchange: "OKEx",
          msg: "-"
        },
        {
          pair: "LTC/USDT",
          exchange: "中币网",
          msg: "-"
        },
        {
          pair: "LTC/USDT",
          exchange: "比特儿",
          msg: "-"
        },
        {
          pair: "LTC/USDT",
          exchange: "OKEx",
          msg: "-"
        },
        {
          pair: "EOS/USDT",
          exchange: "中币网",
          msg: "-"
        },
        {
          pair: "EOS/USDT",
          exchange: "比特儿",
          msg: "-"
        },
        {
          pair: "EOS/USDT",
          exchange: "OKEx",
          msg: "-"
        }
      ];
      let checkCoin = [],
        checkUnit = [],
        checkMarket = [],
        checkSpread ='';
      this.listMarket.forEach(i => {
        if (i.check) {
          checkMarket.push(i.label);
        }
      });
      this.listCoin.forEach(i => {
        if (i.check) {
          checkCoin.push(i.label);
        }
      });
      this.listUnit.forEach(i => {
        if (i.check) {
          checkUnit.push(i.label);
        }
      });
      this.listSpread.forEach(i => {
        if (i.check) {
          let num = i.label?i.label.replace('%',''):0
          checkSpread=num?floatDiv(Number(num),100):0
          checkSpread = Number(checkSpread)
        }
      });

      //开始配对
      if (
        (checkMarket && checkMarket.length < 2) ||
        (checkUnit && checkUnit.length < 1) ||
        (checkCoin && checkCoin.length < 1)
      ) {
        this.selectedItem = [];
        await tradeConfigListClear();
        this.listMarket.forEach(i => {
          checkMarket.push(i.label);
        });
        this.listCoin.forEach(i => {
          checkCoin.push(i.label);
        });
        this.listUnit.forEach(i => {
          checkUnit.push(i.label);
        });
        let resultMarket = this.list(checkMarket);
        let resultUnitMarket = this.listAll(checkUnit, checkCoin);
        let newArr = [resultMarket, resultUnitMarket];
        let res = this.doExchange(newArr);
        //对比删除组
        let newList = [];
        //存入策略组
        let storeList = [];
        for (let k = 0; k < res.length; k++) {
          let resItem = {};
          localStorage[res[k]] = "0";
        }
        return;
      }
      localStorage["selectMarketNow"] = JSON.stringify(checkMarket);
      // this.selectNOM = checkMarket;
      let resultMarket = this.list(checkMarket);
      let resultUnitMarket = this.listAll(checkUnit, checkCoin);
      let newArr = [];
      let res = [];
      for (let o = 0; o < resultMarket.length; o++) {
        newArr = [resultMarket[o], resultUnitMarket];
        res = res.concat(this.doExchange(newArr));
      }

      //对比删除组
      let newList = [];
      //存入策略组
      let storeList = [];
      for (let k = 0; k < res.length; k++) {
        let resItem = {};
        if (localStorage[res[k]] != "undefined") {
          resItem.switch = localStorage[res[k]] == "1" ? true : false;
        }
        res[k] = res[k].split(",");
        resItem.pair = res[k][1];
        resItem.market = res[k][0];
        if (resItem.switch) {
          storeList.push(resItem);
        }
        newList.push(resItem);
      }
      this.selectedItem = newList;
      let user_id = this.$getUserInfo() ? this.$getUserInfo().id : false;
      if (!user_id) {
        return;
      }
      // 将选择的交易对存入数据库where signal in(x,y,z...)
      tradeConfigListClear().then(res => {
        let config = {
          中币网: 1,
          比特儿: 2,
          OKEx: 3
        };
 
        if (storeList && storeList.length > 0) {
          storeList.forEach(async x => {
            let insertOrUpdate = {
              user_id: user_id,
              coin: x.pair.split("/")[0],
              unit: x.pair.split("/")[1],
              currency_pair: x.pair,
              uniform: x.market,
              exchange1: x.market.split("/")[0],
              exchange2: x.market.split("/")[1],
              exchange1_id: x.market.split("/")[0]
                ? config[x.market.split("/")[0]]
                : 0,
              exchange2_id: x.market.split("/")[1]
                ? config[x.market.split("/")[1]]
                : 0,
              exchange1_API_id: x.market.split("/")[0]
                ? config[x.market.split("/")[0]]
                : 0,
              exchange2_API_id: x.market.split("/")[1]
                ? config[x.market.split("/")[1]]
                : 0,
              isShow: x.switch ? 1 : 0,
              status: 1,
              spread: checkSpread,
              sync: 0
            };

            await tradeConfigListAddOrUpdate(insertOrUpdate);
          });
        }
      });
    },
    async clickSwitch(item) {
      localStorage[item.market + "," + item.pair] = item.switch ? "1" : "0";
      await this.checkReady();
    },
    clear() {
      this.$refs.element.handleClear();
      this.coinSelected = 3;
      this.StatusSelected = 3;
      this.dateSelected = "";
      this.dateValue = "";
    }
  },
  destroyed() {
    //清除定时器
    clearInterval(this.timer);
    this.timer = null;
    ipcRenderer.removeAllListeners(["mainCheckMsg", "hedgeMsg"]);
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/less/mixin.less";
.tip{
  margin-bottom:20px;
  clear:both;
  height:36px;
  .leftItem{
    float:left;
    height:36px;
    font-size:14px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(0,201,157,1);
    line-height:36px;
  }
  .rightItem{
    float:right;
    height:36px;
    font-size:14px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(224,32,32,1);
    line-height:36px;
  }
}
.none {
  display: none !important;
}
.pagetion {
  display: flex;
  width: 100%;
  justify-content: center;
}
.top {
  height: 25px !important;
  line-height: 25px !important;
}
.icon-close {
  position: absolute;
  display: inline-block;
  right: 5px;
  top: 10px;
  // margin: 0 10px 0 0;
  width: 15px;
  height: 15px;
  overflow: hidden;
  vertical-align: middle;
  margin-top: -2px;
  background-size: 100%;
  background-repeat: no-repeat;
  .bg-image("../img/guanbi");
}
label,
span {
  font-size: 30px;
}
.green {
  div {
    color: green !important;
  }
}
/deep/ input::-webkit-input-placeholder {
  font-weight: 200;
  color: #fff;
  /* opacity: .7;*/
}
.icon-checkbox {
  display: inline-block;
  width: 12px;
  height: 12px;
  overflow: hidden;
  vertical-align: middle;
  margin-top: -5px;
  margin-right: 7px;
  background-size: 100%;
  background-repeat: no-repeat;
  .bg-image("../img/checkbox");

  &.checked {
    .bg-image("../img/checkbox-checked");
  }
}
.condition {
  display: flex;
  -webkit-flex-wrap: wrap;
  margin-top: 20px;

  .item {
    display: flex;
    margin-bottom: 10px;
    p {
      min-width: 50px;
      max-width: 80px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(83, 105, 118, 1);
      line-height: 36px;
    }

    .btn-clear {
      margin-left: 20px;
      width: 60px;
      height: 30px;
      line-height: 30px;
      background: rgba(102, 102, 102, 1);
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(204, 204, 204, 1);
      text-align: center;
      cursor: pointer;
    }
    .btn-query {
      width: 60px;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 185, 159, 1);
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      margin-left: 20px;
      text-align: center;
      cursor: pointer;
    }
  }
  // .item:nth-child(1) .ivu-select-placeholder {
  //   background: rgba(0, 136, 8, 1) !important;
  // }
  // .item:nth-child(2) .ivu-select-placeholder {
  //   background: rgba(0, 136, 8, 1) !important;
  // }
}
.content_box {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  padding: 20px;
  box-sizing: border-box;
  // width: 1620px;
  display: flex;
  justify-content: center;
}
.left {
  flex: 2;

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
    margin-left: 40px;
  }

  .table_wrap {
    width: 100%;
    height: calc(100% - 52px);
    padding: 0px 20px 20px 20px;
    margin-top: 20px;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
    .table_t {
      display: flex;
      // justify-content: space-between;
      // p {
      //   // font-size: 14px;
      //   // font-family: Source Han Sans CN;
      //   // font-weight: bold;
      //   // color: #666666;
      // }
      p,
      div {
        flex: 1;
        font-size: 14px !important;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #666666;
        height: 20px;
        line-height: 20px;
      }
      .text_center {
        text-align: center;
      }
      .text_right {
        text-align: right;
      }
    }
    .table_l {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #cccccc;
      &.green {
        color: green;
      }
      p,
      div {
        flex: 1;
        font-size: 14px !important;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #666666;
        height: 50px;
        line-height: 50px;
        padding: 0;
        width: 33.333333%;
      }

      .text_left {
        text-align: left;
      }
      .text_center {
        text-align: center;
      }
      .text_right {
        text-align: right;
      }
      .addcolor {
        padding-top: 5px;
        color: #dd1818 !important;
        font-size: 12px !important;
        word-wrap: break-word;
        text-align: left;
        line-height: 20px !important;
      }
      .addcolor2 {
        color: #dd1818 !important;
        font-size: 12px !important;
        // word-wrap:break-word;
        // text-align:left;
        // line-height: 20px !important;
      }
    }
    .table_l:nth-child(2n) {
      p {
        color: #050505;
      }
    }
    .table_l:nth-child(2n + 1) {
      p {
        color: #2a1bfa;
      }
    }
  }
}
.right {
  flex: 3;
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
    margin-left: 40px;
    height: 36px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(0, 136, 8, 1);
    line-height: 36px;
  }
  .tab_wrap {
    width: 100%;
    height: 50%;
    padding: 0px 20px 10px 20px;
    position: relative;
    text-align: center;
    .table_t {
      padding-top: 20px;
      min-width: 500px;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #cccccc;
      p {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(83, 105, 118, 1);
        display: inline-block;
        min-width: 80px;
        text-align: center;
      }
      div {
        flex: 1;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(83, 105, 118, 1);
        // display: inline-block;
        min-width: 80px;
        text-align: center;
      }
    }
    .table_l_wrapper {
      overflow-y: scroll;
      height: 90%;
    }
    .table_l {
      min-width: 500px;
      display: flex;
      // display: inline-block;
      // justify-content: space-between;
      border-bottom: 1px solid #cccccc;

      &.green {
        color: green;
      }
      div {
        flex: 1;
        // display: inline-block;
        min-width: 80px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #666666;
        height: 50px;
        line-height: 50px;
        padding: 0;
        text-align: center;
      }
    }
  }
}
.hedge_wrap {
  padding: 20px 40px 20px 40px;
  // width: 680px;

  .hedge_btn {
    display: flex;

    div {
      width: 80px;
      height: 30px;
      margin-right: 20px;
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 30px;
      text-align: center;
      cursor: pointer;
    }
    div:nth-child(1) {
      background: rgba(20, 136, 204, 1);
      &.open {
        background: rgba(0, 136, 8, 1);
      }
    }
    div:nth-child(2) {
      background: rgba(20, 136, 204, 1);
    }
    div:nth-child(3) {
      background: rgba(20, 136, 204, 1);
    }
  }
}

.pop {
  width: 920px;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  box-shadow: 4px 4px 5px 4px rgba(6, 0, 1, 0.05);
  max-height: calc(100% - 140px);
  overflow-y: scroll;
  padding-top: 20px;
  > h2 {
    height: 18px;
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #1E47A6;
    line-height: 18px;
    text-align: left;
    margin-bottom: 20px;
    margin-left: 20px;
  }
  .setting_wrap {
    margin: 28px 40px;
    // display: flex;
    .list {
      > p {
        min-width: 50px;
        margin-right: 21px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: rgba(83, 105, 118, 1);
      }
      .tab_wrap {
        min-width: 500px;
        height: calc(100% - 118px);
        padding: 0px 40px 10px 40px;

        .table_t {
          padding-top: 20px;
          min-width: 500px;
          display: flex;
          justify-content: space-between;
          // border-top: 1px solid #cccccc;
          p {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: rgba(83, 105, 118, 1);
            flex: 2;
          }
        }

        .table_l {
          min-width: 500px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #cccccc;

          p {
            flex: 1;
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #666666;
            height: 66px;
            line-height: 66px;
            padding: 0;
          }
        }
      }
    }
    .divi {
      height: 2px;
      background: rgba(204, 204, 204, 1);
      margin-bottom: 23px;
    }
    .market {
      display: flex;
      margin-bottom: 26px;
      width: 100%;
      > p {
        min-width: 50px;
        margin-right: 21px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: rgba(83, 105, 118, 1);
      }

      .listItem {
        display: flex;
        .item {
          margin-right: 33px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: rgba(102, 102, 102, 1);
          &.selected {
            color: rgba(0, 201, 157, 1);
          }
        }
      }
    }
  }
}

.shade {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background: black;
  opacity: 0.7;
}
</style>
