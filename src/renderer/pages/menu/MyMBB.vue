<template>
  <div class="content_box">
    <div class="left">
      <h2>我的MBB</h2>
      <h1 class="title">可用：{{num}} MBB</h1>
      <div class="my_record_2">
        <div>锁仓：{{locked}} MBB</div>
        <div>累计释放：{{frozen}} MBB</div>
        <div>今日释放：{{day_frozen}} MBB</div>
      </div>

      <unlock-record></unlock-record>
   
    </div>

    <div class="right">
      <h2>赠送记录</h2>

      <div class='table_wrap wrapper'>
        <div class="list" v-for="(item,index) in recordData" :key="index">
          <div class="row_1">
            <div>
              <p>赠送时间</p>
              <p class="time">{{item.trader_add_time}}</p>
            </div>
            <div>赠送(MBB)</div>
          </div>
          <div class="row_2">
            <div>
              <p>交易对</p>
              <p>{{item.remake}}</p>
            </div>
            <div>{{item.trader_money}}</div>
          </div>
          <div class="row_3">
            <div>
              <p>收益(USDT)</p>
              <p>{{item.trader_money}}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="recordData && recordData.length>0" class="pagetion">
        <Page :total="total" :page-size="limit" show-elevator @on-change="pageEvent"></Page>
      </div>

    </div>
  </div>
</template>
<script>
import util from "../../utils/util";
import { userMbb,getLog } from "../../service/api.js"; //接口
import UnlockRecord from "../component/MyMBB/UnlockRecord"; //释放记录

export default {
  components: {
    UnlockRecord
  },
  data() {
    return {
     num:'',//可用数量
     locked:'',//锁仓数量
     frozen:'',//释放总量
     day_frozen:'',//今日释放量

     total: 0, //总数
     limit: 10,
     recordData: []
    };
  },
  computed: {},
  created() {
    this.init();
    this.pageEvent();
  },
  methods: {
    //userMbb
    async init() {
      let resMbb = await userMbb(
        this.$paramMd5([])
      );
      if (resMbb && resMbb.code === 1) {
        let r=resMbb.data.data
        this.num=r.num //可用数量
        this.locked=r.locked //锁仓数量
        this.frozen=r.frozen //释放总量
        this.day_frozen=r.day_frozen //今日释放量
      }else{
        this.$Notice.error({
          title: res.message
        });
      }
    },
    //赠送记录
    async pageEvent(index) {
      let i = index ? index : 1;
      let res = await getLog(
        this.$paramMd5([`page=${i}`, `limit=10`])
      );
      if (res && res.code == 1) {
        this.recordData = res.data.data;
        this.total = res.data.total;
      } else {
        this.$Notice.error({
          title: res.message
        });
      }
    }

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
  min-width: 460px;
  max-width: 50%;
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
  .title{
    text-align: center;
    color: #00B99F;
    padding: 50px 0 30px 0;
    font-size: 32px;
    font-weight: 200;
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
    height: calc(100% - 95px);
    overflow-y: scroll;    
  }
}


</style>
