<template>
  <div class="commission">
    <div class="top_title">
      <h2>提币地址</h2>
      <div class="addAddress" @click="showPop">新增地址</div>
    </div>
    <div class="tab_wrap">
      <div class="table_l" v-for="(item,index) in addreessList" :key="index">
        <p>{{item.title_short}}</p>
        <p style="overflow:hidden">{{item.name}}</p>
        <p>{{toStart(item.addr)}}</p>
        <p
          v-clipboard:copy="item.addr"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >复制地址</p>
      </div>
    </div>
    <div v-if="addreessList && addreessList.length>0" class="pagetion">
      <Page :total="total" :page-size="limit" show-elevator @on-change="pageEvent"></Page>
    </div>
    <div class="shade" v-show="popFlag"></div>
    <div class="pop" v-show="popFlag">
      <div class="close">
        <span class="icon-close" @click="closePop"></span>
      </div>
      <h2>新增提币地址</h2>
      <div class="input_wrap">
        <p> 币种:</p>
        <Select class="cus-select" v-model="title_short" size="large" placeholder="选择币种">
            <Option value="">选择币种</Option>
            <Option
              v-for="item in coinList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
      </div>
      <div class="input_wrap">
        <p>名称:</p>
        <input type="text" placeholder="请输入十个中文字符长度以内的名称" maxlength="10" v-model="addressName" />
      </div>
      <div class="input_wrap">
        <p>地址:</p>
        <input type="text" v-model="addresss" />
      </div>
      <div class="addAddress_sub" @click="_addrAction">添加</div>
    </div>
  </div>
</template>
<script>
import {coinList2} from "../../../service/config"
import {
  addrAction,
  getAddrAction,
  getUserInfo
} from "../../../service/api.js"; //接口
export default {
  name: "coinAddress",
  data() {
    return {
      popFlag: false,
      addressName: "",
      title_short:"", //币种
      addresss: "",
      addreessList: [],
      total: 0,
      limit: 3,
      is_real: 0,
      coinList: coinList2
    };
  },
  computed: {},
  created() {
    this.pageEvent();
  },
  methods: {
    async showPop() {
      let real = await this._getUserInfo();
      if (real && real == 2) {
        this.popFlag = true;
      } else {
        window.warn("未实名认证无法添加地址");
      }
    },
    closePop() {
      this.popFlag = false;
    },
    onCopy() {
      this.$Notice.success({
        title: "复制成功"
      });
    },
    // 复制失败
    onError() {
      this.$Notice.error({
        title: "复制失败"
      });
    },
    toStart (str) {
      return str.length>6?str.substr(0, 6) + "******" + str.substr(-6):str
    },

    //添加提币地址
    async _addrAction(index) {
      if (this.title_short == "" || this.title_short == undefined) {
        this.$Notice.error({
          title: "请选择币种"
        });
        return;
      }
      if (this.addressName == "") {
        this.$Notice.error({
          title: "请设置提币名称"
        });
        return;
      }
      
      if (this.addresss == "") {
        this.$Notice.error({
          title: "请设置提币地址"
        });
        return;
      }
      let res = await addrAction(
        this.$paramMd5([`title_short=${this.title_short}`,`name=${this.addressName}`, `addr=${this.addresss}`])
      );
      if (res && res.code == 1) {
        this.$Notice.success({
          title: res.message
        });
        this.addressName = "";
        this.addresss = "";
        this.closePop();
        this.pageEvent();
      } else {
        this.$Notice.error({
          title: res.message
        });
      }
    },
    //提币地址
    async pageEvent(index) {
      // console.log("pageEvent");
      let i = index ? index : 1;
      let res = await getAddrAction(this.$paramMd5([`page=${i}`, `limit=3`]));
      if (res && res.code == 1) {
        this.addreessList = res.data;
        this.total = res.data.total;
      } else {
        this.$Notice.error({
          title: res.message
        });
      }
    },
    async _getUserInfo(index) {
      let res = await getUserInfo(this.$paramMd5([]));

      if (res && res.code == 1) {
        this.is_real = res.data.is_real;
        return res.data.is_real;
      } else {
        return 0;
        // window.warn(res.message);
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/less/global.less";
@import "../../../assets/less/mixin.less";
@import "../../../assets/less/common.less";

.commission {
  background: rgba(255, 255, 255, 1);
  padding-top: 20px;
  margin-top: 20px;
  // width: 460px;
  height: 49%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 1px 0px rgba(6, 0, 1, 0.1);
  border-radius: 10px;
  .wrapper {
    overflow-y: scroll;
    height: 80%;
  }
}
.commission {
  .top_title {
    display: flex;
    justify-content: space-between;
    margin: 0 20px;
    h2 {
      height: 18px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #1E47A6;
      line-height: 18px;
    }
    .addAddress {
      width: 100px;
      height: 30px;
      background: rgba(0, 185, 159, 1);
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
    }
  }
}
.text_center {
  text-align: center;
}
.text_right {
  text-align: right;
}

.tab_wrap {
  height: calc(100% - 110px);
  margin-top: 20px;
  box-sizing: border-box;
  overflow-y: scroll;
  padding: 0 20px 30px 20px;
  box-sizing: border-box;
  .table_l {
    p {
      font-weight: bold;
      height: 40px;
      line-height: 40px;
      padding: 0;
      flex:initial;
    }
    p:nth-child(1) {
      width: 50px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p:nth-child(2) {
      width: 25%;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p:nth-child(3) {
      width: 45%;
      text-align: left;
      overflow: hidden;
    }
    p:nth-child(4) {
      width: 58px;
      overflow: hidden;
      cursor: pointer;
    }
    .addcolor {
      color: rgba(102, 102, 102, 1) !important;
    }
  }
}
.shade {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: black;
  opacity: 0.3;
  z-index: 9;
}
.pop {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  width: 580px;
  height: 430px;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  box-shadow: 1px 1px 1px 0px rgba(6, 0, 1, 0.1);
  z-index: 999;
  > h2 {
    text-align: center;
    height: 16px;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(78, 98, 113, 1);
    line-height: 16px;
  }
  .close {
    height: 50px;
    padding-top: 20px;
    box-sizing: border-box;
    > .icon-close {
      float: right;
      margin-right: 20px;
      display: inline-block;
      margin: 0 10px 0 0;
      width: 15px;
      height: 15px;
      overflow: hidden;
      vertical-align: middle;
      margin-top: -2px;
      background-size: 100%;
      background-repeat: no-repeat;
      cursor: pointer;
      .bg-image("../img/guanbi");
    }
  }
  .input_wrap {
    width: 500px;
    margin: 40px;
    height: 40px;
    display: flex;
    > p {
      width: 80px;
      height: 40px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      line-height: 40px;
    }
    > input, > .ivu-select {
      width: 420px;
      height: 40px;
      border: none;
      border: 1px solid rgba(83, 105, 118, 1);
      font-size: 14px;
      font-family: Source Han Sans CN;
      padding-left: 15px;
      font-weight: bold;
      color: rgba(102, 102, 102, 1);
      line-height: 40px;
    }
    > .ivu-select {
      padding-left: 0px;
    }
  }
  .addAddress_sub {
    cursor: pointer;
    width: 500px;
    height: 40px;
    line-height: 40px;
    background: rgba(0, 185, 159, 1);
    text-align: center;
    margin: 40px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
  }
}
</style>
