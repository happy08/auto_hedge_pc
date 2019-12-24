<template>
  <div class="commission">
    <h2>提币记录</h2>
    <div class='wrapper'>
    <div class="list" v-for="(item,index) in recordData" :key="index">
      <div class="row_1">
        <div>
          <p>提币时间</p>
          <p class="time">{{item.add_time}}</p>
        </div>
        <div>提币状态</div>
      </div>
      <div class="row_2">
        <div>
          <p>提币数量</p>
          <p>{{item.zc_num}}</p>
        </div>
        <div>{{item.status}}</div>
      </div>
      <div class="row_3">
        <div>
          <p>提币地址</p>
          <p>{{item.zc_addr}}</p>
        </div>
      </div>
    </div>
    </div>
    
    <div v-if="recordData && recordData.length>0" class="pagetion">
      <Page :total="total" :page-size="limit" show-elevator @on-change="pageEvent"></Page>
    </div>
  </div>
</template>
<script>
import { getMentionMoneyLog } from "../../../service/api.js"; //接口
import Bus from "@/utils/bus";
export default {
  name: "moneyrecord",
  data() {
    return {
      total: 0, //总数
      limit: 10,
      recordData: []
    };
  },
  computed: {},
  created() {
    this.pageEvent(1);
    Bus.$on("TraderLog",msg=>{
      this.pageEvent(1);
    })
  },
  methods: {
    //提币记录
    async pageEvent(index) {
      let i = index ? index : 1;
      let res = await getMentionMoneyLog(
        this.$paramMd5([`page=${i}`, `limit=3`])
      );
      if (res && res.code == 1) {
        this.recordData = res.data.data;
        this.total = res.data.total;
      } else {
        this.$Notice.error({
          title: res.message
        });
      }
    },

  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/less/common.less";

.commission {
  padding-top: 20px;
  padding-bottom: 30px;
  margin-top: 20px;
   height: 49%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 1px 0px rgba(6, 0, 1, 0.1);
  border-radius: 10px;
  
  .wrapper{
    margin-top:12px;
    overflow-y: scroll;
    height: calc(100% - 60px);
  }
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

</style>
