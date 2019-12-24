<template>
  <div>
    <h2>释放记录</h2>
    <div class="wrapper">
      <div class="list" v-for="(item,index) in recordData" :key="index">
        <div class="row_1">
          <div>
            <p>释放时间</p>
            <p class="time">{{item.unlock_time}}</p>
          </div>
        </div>
        <div class="row_2">
          <div>
            <p>释放数量</p>
            <p>{{item.unlock_num}}</p>
          </div>
        </div>
        <div class="row_3">
          <div>
            <p>累计释放</p>
            <p>{{item.frozen}}</p>
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
import { userCoinUnlockList } from "../../../service/api.js"; //接口
export default {
  name: "UnlockRecord",
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
  },

  methods: {
    //提币记录
    async pageEvent(index) {
      let i = index ? index : 1;
      let res = await userCoinUnlockList(this.$paramMd5([]));
      if (res && res.code == 1) {
        //console.log("res.data", res.data);
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
@import "../../../assets/less/common.less";

.wrapper {
  overflow-y: scroll;
  height: calc(100vh - 480px);
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
  .title {
    text-align: center;
    color: #00b99f;
    padding: 50px 0 30px 0;
    font-size: 32px;
    font-weight: 200;
  }
}

.text_center {
  text-align: center;
}
.text_right {
  text-align: right;
}
</style>
