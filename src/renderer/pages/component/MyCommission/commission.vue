<template>
  <div class="commission">
    <h2>我的佣金</h2>
    <div class="my_record_2">
      <div>累计佣金(USDT): <br/>{{traderData.trader_money|myToFixed(2)}}</div>
      <div>剩余佣金(USDT): <br/>{{traderData.usdt|myToFixed(2)}}</div>
    </div>
    <div class="tab_wrap">
      <div class="table_t">
        <p style="text-align:center">流水时间</p>
        <p style="text-align:center">流水类型</p>
        <p style="text-align:center">好友账户</p>
        <p style="text-align:center">变动数量</p>
        <p style="text-align:center">剩余数量</p>
      </div>
  
      <div class="table_l" v-for="(item,index) in traderList" :key="index">
     
        <p style="text-align:center">{{item.trader_add_time}}</p>
        <p style="text-align:center">{{item.trader_operation_type}}</p>
        <p style="text-align:center">{{item.contact}}</p>
        <p style="text-align:center">{{item.trader_money|myToFixed(2)}}</p>
        <p style="text-align:center">{{item.trader_operation_money|myToFixed(2)}}</p>
      </div>  

    
    </div>
      <div v-if="traderList && traderList.length>0" class="pagetion">
        <Page :total="total" :page-size="limit" show-elevator @on-change="pageEvent"></Page>
      </div>
  </div>
</template>
<script>
import { getTraderLog } from "../../../service/api.js"; //接口
import Bus from "@/utils/bus";
export default {
  name: "commission",
  data() {
    return {
      total: 0, //总数
      limit: 10,
      traderList: [],
      traderData: {},
     
    };
  },
  computed: {},
  created() {
    this._getTraderLog(1);
    Bus.$on("TraderLog",msg=>{
     this._getTraderLog(1);
    })
  },
  methods: {
    //我的佣金 日志
    async _getTraderLog(index) {
      let res = await getTraderLog(
        this.$paramMd5([`page=${index}`, `limit=${this.limit}`])
      );
      if (res && res.code == 1) {
        this.traderData = res.data;
        this.total = res.data.total;
        this.traderList = res.data.data;
        this.traderList.forEach((e,index) => {
          if(e.trader_uid.phone !=''){
            this.traderList[index].contact=this.$options.filters.toStart(e.trader_uid.phone,3,-3) 
          }else if(e.trader_uid.email !=''){
            this.traderList[index].contact=this.$options.filters.toStart(e.trader_uid.email,3,-3) 
          }else{
            this.traderList[index].contact="-"
          }
        });
      } else {
        this.$Notice.error({
          title: res.message
        });
      }
    },
    pageEvent(index) {
      this._getTraderLog(index);
    },
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/less/common.less";

.commission {
  padding-top: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 1px 0px rgba(6, 0, 1, 0.1);
  border-radius: 10px;
   height: 49%;
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
.tab_wrap {
  height: calc(100% - 180px);
  margin-top: 20px;
  box-sizing: border-box;
  overflow-y: scroll;
  padding: 0 20px 0px 20px;
  box-sizing: border-box;

  .table_l {
    p {
      height: 40px;
      line-height: 1;
      padding: 15px 0;
      font-size: 12px;
    }
  }
}
.my_record_2 {
  > div {
    flex: 1;
  }
  > div:nth-child(1) {
    margin-right: 40px;
  }
}
</style>
