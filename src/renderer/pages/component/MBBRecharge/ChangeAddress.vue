<template>
  <div class="commission">
    <h2>选择地址</h2>
    <div class="tab_wrap">
      <div class="table_l" v-for="(item,index) in addreessList" :key="index" @click="addresss=item.addr">
        <p>{{item.title_short}} &nbsp; {{item.name}}</p>
        <div>
          <p>{{item.addr}}</p>

          <RadioGroup class="cus_radio" v-model="addresss">
            <p>
              <Radio :label="item.addr">
                <span></span>
              </Radio>
            </p>
          </RadioGroup>
        </div>
      </div>
    </div>

    <div class="input_wrap">
        <a class="submitBtn" @click="submitBtn">选择地址</a>
    </div>

  </div>
</template>
<script>
import {
  addrAction,
  getAddrAction,
  getUserInfo
} from "../../../service/api.js"; //接口
export default {
  props:["addreessList"],
  name: "ChangeAddress",
  data() {
    return {
      addressName: "",
      addresss: "",
      //addreessList: [],
      is_real: 0
    };
  },
  computed: {},
  created() {
    
  },
  methods: {
    submitBtn(){
      if(this.addresss!=''){
           this.$emit("getAddress",this.addresss)
      }else{
        this.$Notice.error({
          title: "请选择地址"
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/less/global.less";
@import "../../../assets/less/mixin.less";
.commission {
  background: rgba(255, 255, 255, 1);
  padding-top: 0px;
  // width: 460px;
  height: 400px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 1px 0px rgba(6, 0, 1, 0.1);
  border-radius: 10px;
  h2 {
    text-align: center;
    height: 18px;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #666766;
    line-height: 18px;
  }
  .wrapper {
    overflow-y: scroll;
    height: 80%;
  }
}
.input_wrap{
  padding: 30px;
}
.submitBtn{
  display: block;
    box-sizing: border-box;
    height: 40px;
    background: #00b99f;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #ffffff;
    cursor: pointer;
}

.tab_wrap {
  height: 65%;
  margin-top: 20px;
  box-sizing: border-box;
  overflow-y: scroll;
  padding: 0 20px 30px 20px;
  box-sizing: border-box;
  .table_l {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #cccccc;
    padding: 10px 0;
    div {
      display: flex;
      justify-content: space-between;
      p:nth-child(1) {
        width: 80%;
        text-align: left;
      }
      p:nth-child(2) {
        width: 20%;
        text-align: right;
        cursor: pointer;
      }
    }
    p {
      font-weight: bold;
      line-height: 1.5;
      height: auto;
      padding: 0;
      font-size: 14px;
      font-family: Source Han Sans CN;
      color: rgba(51, 51, 51, 1);
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
 
}
</style>
