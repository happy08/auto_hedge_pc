<template>
  <div class="commission">
    <h2>{{title}}记录</h2>
    <div class="wrapper">
      <div class="list" v-for="(item,index) in recordData" :key="index">
        <div class="row_1">
          <div>
            <p>{{title}}时间</p>
            <p class="time">{{item.add_time}}</p>
          </div>
          <div>{{title}}状态</div>
        </div>
        <div class="row_2">
          <div>
            <p>{{title}}数量</p>
            <p>{{item.num}}</p>
          </div>
          <div :class="[item.status== '提币失败' ? 'red': '', (item.status=='提交审核'||item.status=='申请中')? 'green': '']">{{item.status}}</div>
        </div>
        <div class="row_3">
          <div>
            <p>转出地址</p>
            <p>{{item.from_address}}</p>
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
import { userCoinInoutList } from "../../../service/api.js"; //接口
import Bus from "@/utils/bus";
export default {
  name: "moneyrecord",
  props: {
    type: {
      type: Number,
      default: 0 //type 0 全部 1 充币 2 提币
    }
  },
  data() {
    return {
      title: "",
      total: 0, //总数
      limit: 10,
      recordData: []
    };
  },
  computed: {},
  created() {
    this.pageEvent(1);

    Bus.$on("RechargeRecord",msg=>{//更新提币记录
      if(this.type==2){
        this.pageEvent(1);
      }
    })

  },
  watch: {
    type: {
      immediate: true,
      handler(val) {
        if (val == 1) {
          this.title = "充币";
        } else if (val == 2) {
          this.title = "提币";
        }
      }
    }
  },
  methods: {
    //提币记录
    async pageEvent(index) {
      let i = index ? index : 1;
      let res = await userCoinInoutList(
        this.$paramMd5([`type=${this.type}`, `page=${i}`, `limit=10`])
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
    

  },
  beforeDestroy () {
    Bus.$off("RechargeRecord")
  },
  
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

  .wrapper {
    margin-top: 12px;
    overflow-y: scroll;
    height: 80%;
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
