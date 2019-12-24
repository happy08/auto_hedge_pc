<template>
  <div class="content_box">
    <div class="left">
      <h2>市场行情</h2>
      <div class="table_wrap" v-if="trade2&&trade2.length==0 && trade1&&trade1.length==0">
        <Spin size="large" fix></Spin>
      </div>
      <!-- <div class="table_wrap" v-if="trade2&&trade2.length>0 && trade1&&trade1.length>0"> -->
      <div class="table_wrap" v-else>
        <div class="table_t">
          <p>交易对</p>
          <p class="text_center">市场</p>
          <p class="text_center">交易量</p>
          <p class="text_right">最新价</p>
          <p class="text_right">涨跌幅(%)</p>
        </div>
        <div class="table_l" v-for="item in trade2" :key="item.time">
          <p>
            <span>{{item.pair}}</span>
          </p>
          <p class="text_center color_1">{{item.exchange}}</p>
          <p class="text_center">{{item.vol}}</p>
          <P class="text_right double">
            <span>{{item.last}}</span>
            <span>￥{{item.last_cny}}</span>
          </P>
          <!-- <P class="text_right" >{{item.percent}}</P> -->
          <P
            class="text_right"
            :class="{ 'up': item.percent>0 ,  'down': item.percent<0 }"
          >{{item.percent}}%</P>
        </div>
        <div class="table_l" v-for="item in trade3" :key="item.time">
          <p>
            <span>{{item.pair}}</span>
          </p>
          <p class="text_center color_1">{{item.exchange}}</p>
          <p class="text_center">{{item.vol}}</p>
          <P class="text_right double">
            <span>{{item.last}}</span>
            <span>￥{{item.last_cny}}</span>
          </P>
          <P class="text_right">{{item.percent !='-'?item.percent:item.percent+'%'}}</P>
        </div>
        <div class="table_l" v-for="item in trade1" :key="item.time">
          <p>
            <span>{{item.pair}}</span>
          </p>
          <p class="text_center color_1">{{item.exchange}}</p>
          <p class="text_center">{{item.vol}}</p>
          <P class="text_right double">
            <span>{{item.last}}</span>
            <span>￥{{item.last_cny}}</span>
          </P>
          <P class="text_right">{{item.percent !='-'?item.percent:item.percent+'%'}}</P>
        </div>
      </div>
    </div>
    <div class="right">
      <h2>收益排名</h2>
      <div class="my_record_1">
        <div>我的排名: {{myRank}}</div>
        <div>我的收益(USDT): {{myIncome}}</div>
      </div>
      <div class="tab_wrap">
        <div class="table_t">
          <p>收益排名</p>
          <p class="text_center">用户名</p>
          <p class="text_right">搬砖收益(USDT)</p>
        </div>
        <div class="table_l" v-for="(item,index) in rank" :key="index">
          <p>{{item.rank}}</p>
          <p class="text_center">{{item.user_name}}</p>
          <p class="text_right">{{item.income}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from "../../utils/util";
import {
  sort_ASCII,
  sleep,
  floatAdd,
  floatDiv,
  floatSub,
  floatMul
} from "../../utils/common";

import {
  getUserInfo,
  getUserRank,
  zbTrade,
  okexTrade,
  gateioTrade
} from "../../service/api";

const pako = require("pako");
import { exchangeAPIList, tradeTricks } from "../../controller/common";
import { mainLink } from "../../controller/exchange_base";
export default {
  data() {
    return {
      entry:1,
      tradeList: [],
      trade1: [
        {
          pair: "BTC/USDT",
          exchange: "中币网",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        },
        {
          pair: "ETH/USDT",
          exchange: "中币网",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        },
        {
          pair: "ETC/USDT",
          exchange: "中币网",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        },
        {
          pair: "LTC/USDT",
          exchange: "中币网",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        },
        {
          pair: "EOS/USDT",
          exchange: "中币网",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        }
      ],
      trade2: [
        {
          pair: "BTC/USDT",
          exchange: "比特儿",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        },
        {
          pair: "ETH/USDT",
          exchange: "比特儿",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        },
        {
          pair: "ETC/USDT",
          exchange: "比特儿",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        },
        {
          pair: "LTC/USDT",
          exchange: "比特儿",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        },
        {
          pair: "EOS/USDT",
          exchange: "比特儿",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        }
      ],
      trade3: [
        {
          pair: "BTC/USDT",
          pair_ori: "BTC-USDT",
          exchange: "OKEx",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        },
        {
          pair: "ETH/USDT",
          pair_ori: "ETH-USDT",
          exchange: "OKEx",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        },
        {
          pair: "ETC/USDT",
          pair_ori: "ETC-USDT",
          exchange: "OKEx",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        },
        {
          pair: "LTC/USDT",
          pair_ori: "LTC-USDT",
          exchange: "OKEx",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        },
        {
          pair: "EOS/USDT",
          pair_ori: "EOS-USDT",
          exchange: "OKEx",
          vol: "-",
          last: "-",
          last_cny: "-",
          percent: "-"
        }
      ],
      myRank: "",
      myIncome: "",
      rank: [],
      timer: null,
      wsuri1: "wss://api.zb.live/websocket",
      wsuri2: "wss://ws.gateio.ws/v3/",
      wsuri3: "wss://real.okex.com:8443/ws/v3",
      websock1: null,
      websock2: null,
      websock3: null,
      price_rate_base_zb: null,
      price_rate_zb: null,
      price_rate_cny_zb: null,
      price_rate_base_gate: null,
      price_rate_gate: null,
      price_rate_cny_gate: null,
      params2: ["BTC/USDT", "ETH/USDT", "ETC/USDT", "LTC/USDT", "EOS/USDT"]
    };
  },
  computed: {},
  created() {
    let _this = this;

    this.trickNow();
    this._getUserInfo();
    this._getUserRank();

    this.initWebSocket1();
    this.initWebSocket2();
    // this.initWebSocket3();
  },
  methods: {
    initWebSocket1() {
      this.websock1 = new WebSocket(this.wsuri1);
      this.websock1.onmessage = this.websocketonmessage1;
      this.websock1.onopen = this.websocketonopen1;
      this.websock1.onerror = this.websocketonerror1;
      this.websock1.onclose = this.websocketclose1;
    },
    initWebSocket2() {
      this.websock2 = new WebSocket(this.wsuri2);
      this.websock2.onmessage = this.websocketonmessage2;
      this.websock2.onopen = this.websocketonopen2;
      this.websock2.onerror = this.websocketonerror2;
      this.websock2.onclose = this.websocketclose2;
    },
    initWebSocket3() {
      this.websock3 = new WebSocket(this.wsuri3);
      this.websock3.onmessage = this.websocketonmessage3;
      this.websock3.onopen = this.websocketonopen3;
      this.websock3.onerror = this.websocketonerror3;
      this.websock3.onclose = this.websocketclose3;
    },
    websocketonopen1() {
      let actions = [
        {
          event: "addChannel",
          channel: "btcusdt_ticker"
        },
        {
          event: "addChannel",
          channel: "btcqc_ticker"
        },
        {
          event: "addChannel",
          channel: "ethusdt_ticker"
        },
        {
          event: "addChannel",
          channel: "etcusdt_ticker"
        },
        {
          event: "addChannel",
          channel: "ltcusdt_ticker"
        },
        {
          event: "addChannel",
          channel: "eosusdt_ticker"
        }
      ];

      for (let i = 0; i < actions.length; i++) {
        this.websocketsend1(JSON.stringify(actions[i]));
      }
    },
    websocketonopen3() {
      let test = { op: "subscribe", args: ["spot/ticker:ETH-USDT"] };
      let actions = [
        {
          op: "subscribe",
          channel: "btcusdt_ticker"
        },
        {
          event: "addChannel",
          channel: "btcqc_ticker"
        },
        {
          event: "addChannel",
          channel: "ethusdt_ticker"
        },
        {
          event: "addChannel",
          channel: "etcusdt_ticker"
        },
        {
          event: "addChannel",
          channel: "ltcusdt_ticker"
        },
        {
          event: "addChannel",
          channel: "eosusdt_ticker"
        }
      ];

      this.websocketsend3(JSON.stringify(test));
      // for (let i = 0; i < actions.length; i++) {
      //   this.websocketsend3(JSON.stringify(actions[i]));
      // }
    },
    websocketonopen2() {
      let cmd = "ticker.subscribe";

      let params = [
        "BTC_CNYX",
        "BTC_USDT",
        "ETH_USDT",
        "ETC_USDT",
        "LTC_USDT",
        "EOS_USDT"
      ];

      var msg = {
        id: 2,
        method: cmd,
        params: params
      };
      this.websocketsend2(JSON.stringify(msg));
    },
    websocketonerror3() {
      //连接建立失败重连
      this.initWebSocket3();
    },
    websocketonerror2() {
      //连接建立失败重连
      this.initWebSocket2();
    },
    websocketonerror1() {
      //连接建立失败重连
      this.initWebSocket1();
    },
    async websocketonmessage1(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      // //console.log("中币websocket返回：", redata);

      let params = {
        btcusdt_ticker: 0,
        ethusdt_ticker: 1,
        etcusdt_ticker: 2,
        ltcusdt_ticker: 3,
        eosusdt_ticker: 4
      };
      if (!redata || !redata.ticker || !redata.channel) {
        return;
      }
      let res1 = {
        pair: "",
        exchange: "中币网",
        vol: "",
        last_cny: "-",
        last: "-",
        percent: "暂无",
        time: new Date().getTime() + 1 + Math.random()
      };
      if (redata.channel == "btcusdt_ticker") {
        this.price_rate_base_zb = redata.ticker.last;
        this.price_rate_zb =
          this.price_rate_cny_zb && this.price_rate_base_zb
            ? floatDiv(this.price_rate_cny_zb, this.price_rate_base_zb)
            : 0;
      }

      if (redata.channel != "btcqc_ticker") {
        res1.pair = this.params2[params[redata.channel]];
        res1.vol = redata.ticker.vol;
        (res1.last_cny = this.price_rate_zb
          ? floatMul(this.price_rate_zb, redata.ticker.last).toFixed(2)
          : "-"),
          (res1.last = redata.ticker.last);
        // res1.percent = redata.ticker
      }
      if (redata.channel == "btcqc_ticker") {
        this.price_rate_cny_zb = redata.ticker.last;
        this.price_rate_zb =
          this.price_rate_cny_zb && this.price_rate_base_zb
            ? floatDiv(this.price_rate_cny_zb, this.price_rate_base_zb)
            : 0;
        return;
      }

      this.trade1.splice(params[redata.channel], 1, res1);

      // let res1 = {
      //   pair: redata.channel,
      //   exchange: "中币网",
      //   vol: t1.ticker.vol,
      //   last_cny:price_rate_1?floatMul(price_rate_1,t1.ticker.last).toFixed(2):"-",
      //   last: t1.ticker.last,
      //   percent: "暂无",
      //   time: new Date().getTime() + 1
      // };
      // let t2 = await gateioTrade(x[0].replace("/", "_"));

      // if (!t2) {
      //   return true;
      // }
      // if(x[0] == "BTC/USDT"){
      //     let t2_cny = await gateioTrade(x[2].replace("/", "_"));
      //   price_rate_2 =  floatDiv(t2_cny.last,t2.last)
      // }
      // let res2 = {
      //   pair: x[0],
      //   exchange: "比特儿",
      //   vol: t2.baseVolume ? Number(t2.baseVolume).toFixed(3) : 0,
      //   last: t2.last,
      //   last_cny:price_rate_2?floatMul(price_rate_2,t2.last).toFixed(2):"-",
      //   percent: t2.percentChange,
      //   time: new Date().getTime() + 2
      // };
      // //console.log('j---',j,res1,res2)
      // //console.log('arr---',arr.length)
      // _this.trade1.splice(j, 1, res1);
      // _this.trade2.splice(j, 1, res2);
    },
    async websocketonmessage2(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      // //console.log("比特儿websocket返回：", redata);
      if (!redata) {
        return;
      }

      let params = {
        BTC_USDT: 0,
        ETH_USDT: 1,
        ETC_USDT: 2,
        LTC_USDT: 3,
        EOS_USDT: 4
      };
      if (!redata || !redata.params) {
        return;
      }
      let res1 = {
        pair: "",
        exchange: "比特儿",
        vol: "",
        last_cny: "-",
        last: "-",
        percent: "暂无",
        time: new Date().getTime() + 1 + Math.random()
      };
      if (redata.params[0] == "BTC_USDT") {
        this.price_rate_base_gate = redata.params[1].last;
        this.price_rate_gate =
          this.price_rate_cny_gate && this.price_rate_base_gate
            ? floatDiv(this.price_rate_cny_gate, this.price_rate_base_gate)
            : 0;
      }

      if (redata.params[0] != "BTC_CNYX") {
        res1.pair = this.params2[params[redata.params[0]]];
        res1.vol = redata.params[1].baseVolume
          ? Number(redata.params[1].baseVolume).toFixed(2)
          : 0;
        (res1.last_cny = this.price_rate_gate
          ? floatMul(this.price_rate_gate, redata.params[1].last).toFixed(2)
          : "-"),
          (res1.last = redata.params[1].last);
        res1.percent = redata.params[1].change;
      }
      if (redata.params[0] == "BTC_CNYX") {
        this.price_rate_cny_gate = redata.params[1].last;
        this.price_rate_gate =
          this.price_rate_cny_gate && this.price_rate_base_gate
            ? floatDiv(this.price_rate_cny_gate, this.price_rate_base_gate)
            : 0;
        return;
      }

      this.trade2.splice(params[redata.params[0]], 1, res1);
    },
    async websocketonmessage3(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      //console.log("OKEx websocket返回：", redata);
      if (data instanceof String) {
        //console.log(data);
      } else {
        try {
          //console.log(
          //   "OKEx接受解压消息----",
          //   pako.inflateRaw(data, { to: "string" })
          // );
        } catch (err) {
          //console.log(err);
        }
      }
      //   if (!redata) {
      //     return;
      //   }

      //   let params = {
      //     "BTC_USDT":0,
      //     "ETH_USDT":1,
      //     "ETC_USDT":2,
      //     "LTC_USDT":3,
      //     "EOS_USDT":4
      //   };
      //   if (!redata || !redata.params ) {
      //     return;
      //   }
      //   let res1 = {
      //     pair: '',
      //     exchange: "比特儿",
      //     vol: '',
      //     last_cny:"-",
      //     last: '-',
      //     percent: "暂无",
      //     time: new Date().getTime() + 1 + Math.random()
      //   };
      //    if (redata.params[0] == "BTC_USDT") {
      //     this.price_rate_base_gate = redata.params[1].last
      //     this.price_rate_gate = this.price_rate_cny_gate&&this.price_rate_base_gate?floatDiv(this.price_rate_cny_gate,this.price_rate_base_gate):0;

      //  }

      //   if (redata.params[0]!= "BTC_CNYX") {
      //     res1.pair = this.params2[params[redata.params[0]]]
      //     res1.vol = redata.params[1].baseVolume?Number(redata.params[1].baseVolume).toFixed(2):0;
      //     res1.last_cny = this.price_rate_gate?floatMul(this.price_rate_gate,redata.params[1].last).toFixed(2):"-",
      //     res1.last = redata.params[1].last
      //     res1.percent = redata.params[1].change

      //  }
      //   if (redata.params[0] == "BTC_CNYX") {
      //     this.price_rate_cny_gate = redata.params[1].last
      //     this.price_rate_gate = this.price_rate_cny_gate&&this.price_rate_base_gate?floatDiv(this.price_rate_cny_gate,this.price_rate_base_gate):0;
      //     return;
      //   }

      //  this.trade2.splice(params[redata.params[0]], 1, res1);
    },
    websocketsend1(Data) {
      //数据发送
      this.websock1.send(Data);
    },
    websocketsend2(Data) {
      //数据发送
      this.websock2.send(Data);
    },
    websocketsend3(Data) {
      //数据发送
      this.websock3.send(Data);
    },

    websocketclose1(e) {
      //关闭
      //console.log("断开连接", e);
    },
    websocketclose2(e) {
      //关闭
      //console.log("断开连接", e);
    },
    websocketclose3(e) {
      //关闭
      //console.log("断开连接", e);
    },
    async trickNow() {
      //连接交易所
      let data1 = {
        id: 1
      };
      let data2 = {
        id: 2
      };
      let _this = this;
       
      while (true) {
        if(!this.entry){
          return;
        }
        await sleep(1000);
        _this.trade3.forEach(async element => {
          //console.log('element---',element)
          if (element) {
            await _this.tradeIt(element);
          }
        });
      }

      // try {
      //   (async () => {
      //     let link1 = await mainLink(data1);
      //     let link2 = await mainLink(data2);
      //     _this.trade(link1, link2, data1, data2);
      //     _this.trade(link1, link2, data1, data2);
      //     _this.timer = setInterval(async () => {
      //       _this.trade(link1, link2, data1, data2);
      //       _this.trade(link1, link2, data1, data2);
      //     }, 10000);
      //   })();
      // } catch (e) {
      //   this.timer && clearInterval(this.timer);
      //   this.timer = null;
      //   this.newTimer && clearInterval(this.newTimer);
      //   this.newTimer = null;
      //   // //console.log(e);
      // }
    },
    async _getUserInfo(index) {
      //console.log("_getUserInfo");
      let res = await getUserInfo(this.$paramMd5([]));

      if (res && res.code == 1) {
        this.myIncome = res.data.income ? res.data.income : "暂无";
        this.myRank = res.data.incomeRank ? res.data.incomeRank : "暂无";
      } else {
        window.warn(res.message);
      }
    },
    async _getUserRank(index) {
      let res = await getUserRank(this.$paramMd5([]));
      ////console.log(res);
      if (res && res.code == 1) {
        this.rank = res.data;
      } else {
        window.warn(res.message);
      }
    },
    async tradeIt(element) {
      let price_rate;
      let arr = {
        "BTC-USDT": 0,
        "ETH-USDT": 1,
        "ETC-USDT": 2,
        "LTC-USDT": 3,
        "EOS-USDT": 4
      };

      let _this = this;
      try {
        let t1 = await okexTrade(element.pair_ori);
        // if (element.pair_ori == "BTC-USDT") {
        //   let t2 = await okexTrade("CNY-BTC");

        //   if (t1 && t1.last && t2 && t2.last) {
        //     price_rate = floatDiv(t1.last, t2.last);
        //   }
        // }
        if(!t1){
          return
        }
        await sleep();
        let res2 = {
          pair_ori: element.pair_ori,
          pair: element.pair,
          exchange: "OKEx",
          vol: t1.base_volume_24h ? Number(t1.base_volume_24h).toFixed(3) : 0,
          last: t1.last,
          last_cny: this.price_rate_gate ? floatMul(this.price_rate_gate, t1.last).toFixed(2) : "-",
          percent: "暂无",
          time: new Date().getTime() + 2 + Math.random()
        };
        let j = arr[element.pair_ori];
        //console.log(j);
        _this.trade3.splice(j, 1, res2);
      } catch (e) {
        //console.log(e);
        this.entry =0
      }
    },
    async trade(link1, link2, data1, data2) {
      try {
        
        let arr = [
          ["BTC/USDT", "BTC/QC", "BTC/CNYX"],
          ["ETH/USDT", "ETH/QC", "ETH/CNYX"],
          ["ETC/USDT", "ETC/QC", "ETC/CNYX"],
          ["LTC/USDT", "LTC/QC", "LTC/CNYX"],
          ["EOS/USDT", "EOS/QC", "EOS/CNYX"]
        ];
        let arr1 = [["BTC/QC"], ["ETH/QC"], ["ETC/QC"], ["LTC/QC"], ["EOS/QC"]];
        let arr2 = [
          ["BTC/CNYX"],
          ["ETH/CNYX"],
          ["ETC/CNYX"],
          ["LTC/CNYX"],
          ["EOS/CNYX"]
        ];

        let _this = this;
        let j = 0;
        let price_rate_1 = 0;
        let price_rate_2 = 0;
        this.newTimer = setInterval(async () => {
          if (arr && arr.length > 0) {
            let x = arr.shift();

            // x.forEach(async (e, i) => {
            if (x) {
              // let newarr = [x[i]];
              let t1 = await zbTrade(x[0]);

              if (!t1) {
                return true;
              }
              // let a = {
              //   date: "1570001839201",
              //   ticker: {
              //     high: "8488.02",
              //     vol: "4325.0700",
              //     last: "8224.68",
              //     low: "8155.38",
              //     buy: "8225.63",
              //     sell: "8225.66"
              //   }
              // };
              // let b = {
              //   quoteVolume: "1021.1454353742",
              //   baseVolume: "8476682.797223264029",
              //   highestBid: "8218.46",
              //   high24hr: "8495",
              //   last: "8225.71",
              //   lowestAsk: "8225.71",
              //   elapsed: "6ms",
              //   result: "true",
              //   low24hr: "8151.93",
              //   percentChange: "-1.66"
              // };
              if (x[0] == "BTC/USDT") {
                let t1_cny = await zbTrade(x[1]);
                if (t1_cny && t1_cny.ticker && t1 && t1.ticker) {
                  price_rate_1 = floatDiv(t1_cny.ticker.last, t1.ticker.last);
                }
              }

              let res1 = {
                pair: x[0],
                exchange: "中币网",
                vol: t1.ticker.vol,
                last_cny: price_rate_1
                  ? floatMul(price_rate_1, t1.ticker.last).toFixed(2)
                  : "-",
                last: t1.ticker.last,
                percent: "暂无",
                time: new Date().getTime() + 1 + Math.random()
              };
              let t2 = await gateioTrade(x[0].replace("/", "_"));

              if (!t2) {
                return true;
              }
              if (x[0] == "BTC/USDT") {
                let t2_cny = await gateioTrade(x[2].replace("/", "_"));
                if (t2_cny && t2_cny.last && t2 && t2.last) {
                  price_rate_2 = floatDiv(t2_cny.last, t2.last);
                }
              }
              let res2 = {
                pair: x[0],
                exchange: "比特儿",
                vol: t2.baseVolume ? Number(t2.baseVolume).toFixed(3) : 0,
                last: t2.last,
                last_cny: price_rate_2
                  ? floatMul(price_rate_2, t2.last).toFixed(2)
                  : "-",
                percent: t2.percentChange,
                time: new Date().getTime() + 2 + Math.random()
              };

              _this.trade1.splice(j, 1, res1);
              _this.trade2.splice(j, 1, res2);
              j++;
            }
          }
        }, 2000);
      } catch (e) {
        // //console.log("tradeInfo-----", e);
        this.timer && clearInterval(this.timer);
        this.timer = null;
        this.newTimer && clearInterval(this.newTimer);
        this.newTimer = null;
      }
    }
  },
  destroyed() {
    //清除定时器
    this.timer && clearInterval(this.timer);
    this.timer = null;
    this.newTimer && clearInterval(this.newTimer);
    this.newTimer = null;
    ////console.log("destroyed");
  this.entry= 0
    this.websock1.close(); //离开路由之后断开websocket连接
    this.websock2.close(); //离开路由之后断开websocket连接
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
  justify-content: center;
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
.text_center {
  text-align: center;
}
.text_right {
  text-align: right;
}
.left {
  flex: 1;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
  border-radius: 10px;
  float: left;
  // margin-left: 20px;
}
.right {
  float: left;
  flex: 1;
  height: 100%;
  // overflow-y: scroll;
  margin-left: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
  border-radius: 10px;
  // margin-right: 20px;
}
.table_wrap {
  position: relative;
  height: calc(100% - 58px);
  padding: 0px 20px 20px 20px;
  overflow-y: scroll;
  margin-top: 20px;
  .table_t {
    display: flex;
    justify-content: space-between;
    p {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(83, 105, 118, 1);
      flex: 2;
    }
  }

  .table_l {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #cccccc;

    .up {
      color: red !important;
    }
    .down {
      color: green !important;
    }
    > p {
      flex: 1;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(83, 105, 118, 1);
      height: 66px;
      line-height: 66px;
      padding: 0;
    }
    .color_1 {
      color: rgba(102, 102, 102, 1) !important;
    }
    .double {
      display: flex;
      flex-direction: column;
      justify-content: center;
      span {
        display: inline-block;
        width: 100%;
        height: 16px !important;
        line-height: 16px !important;
      }
      span:nth-child(1) {
        color: #666666;
      }
      span:nth-child(2) {
        color: #333;
      }
    }
  }
}
.tab_wrap {
  height: calc(100% - 118px);
  padding: 0px 20px 20px 20px;
  overflow-y: scroll;
  margin-top: 20px;
  .table_t {
    display: flex;
    justify-content: space-between;
    p {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(83, 105, 118, 1);
      flex: 2;
    }
  }
  .table_l {
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
.my_record_1 {
  display: flex;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  > div {
    flex: 1;
    padding-left: 5px;
    padding-right: 5px;
    min-width: 110px;
    height: 40px;
    background: #E3F8FE;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
  }
  > div:nth-child(1) {
    margin-right: 40px;
  }
}
</style>
