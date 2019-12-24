<template>
  <div class="content_box">
    <div class="shade" @click="closePop" v-show="popFlag"></div>
    <div class="left">
      <h2>充值购买</h2>
      <div class="member">
        <p>会员权限</p>
        <div class="time_select clearfix">
          <div
            :class="{'active':permissionData.seven_day==current}"
            @click="checked_time(permissionData.seven_day,permissionData.seven_day_price)"
          >7天体验</div>
          <div
            style=" margin-left: 20px;"
            :class="{'active':permissionData.three_month==current}"
            @click="checked_time(permissionData.three_month,permissionData.three_month_price)"
          >3个月(92天)</div>
          <div
            :class="{'active':permissionData.six_month==current}"
            @click="checked_time(permissionData.six_month,permissionData.six_month_price)"
          >6个月(183天)</div>
          <div
            style=" margin-left: 20px;"
            :class="{'active':permissionData.one_year==current}"
            @click="checked_time(permissionData.one_year,permissionData.one_year_price)"
          >1年(365天)</div>
        </div>
      </div>
      <div class="cost">
        <p>购买费用</p>
        <div class="price">{{checked_price}} USDT</div>
        <div class="submit_btn" @click="_confirmOrder">确认购买</div>
      </div>
    </div>
    <div class="right">
      <h2>我的订单</h2>
      <div class="order_tab clearfix">
        <div :class="{'order_active':order_current==1 }" @click="order_tab(1)">待付款</div>
        <div :class="{'order_active':order_current==2 }" @click="order_tab(2)">待确认</div>
        <div :class="{'order_active':order_current==3 }" @click="order_tab(3)">已完成</div>
      </div>
      <div class="order_list_wrap">
        <div
          class="order_list"
          @click="detailOrder(item)"
          v-for="(item,index) in orders"
          :key="index"
        >
          <div class="order_list_l">
            <p>
              <span>订单编号</span>
              {{item.order_sn}}
            </p>
            <p>
              <span>价格</span>
              {{item.goods_price}}
            </p>
            <p>
              <span>权限</span>
              {{item.auth_type}}天
            </p>
          </div>
          <div class="order_list_r">
            <p>{{item.add_time}}</p>
            <div v-if="item.order_status == 1" class="no_pay">
              <div @click="cancelOrder(item.order_id)">取消订单</div>
              <div @click="payOrder(item)">去付款</div>
            </div>
          </div>
        </div>
        <div v-if="orders && orders.length>0" class="pagetion">
          <Page :total="total" :page-size="limit" show-elevator @on-change="pageEvent"></Page>
        </div>
      </div>
    </div>

    <div class="pop middle" v-show="popFlag">
      <i @click="closePop" class="icon-close"></i>
      <h2>订单详情</h2>
      <div class="order_detail">
        <div class="transfer">
          <h2>转账信息</h2>
          <div class="QR_code">
            <div class="qr_wrap">
              <div id="qrcode" class="two-code" ref="qrcode"></div>
            </div>
          </div>
          <div class="receipt_id">
            <p>收币地址:</p>
            <p>{{address}}</p>
            <span
              v-clipboard:copy="address"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >复制</span>
          </div>
        </div>
        <div class="order">
          <div class="order_status">
            <h2>订单状态</h2>
            <div class="wrap">
              <div class="list" v-for="(item,index) in status" :key="index">
                <div>{{item.add_time}}</div>
                <div>{{item.descri}}</div>
              </div>
            </div>
          </div>
          <div class="order_info">
            <h2>订单信息</h2>
            <p>
              <span>订单编号:</span>
              <span>{{order_sn}}</span>
            </p>
            <p>
              <span>权限天数:</span>
              <span>{{current}}</span>
            </p>
            <p>
              <span>购买金额:</span>
              <span>{{checked_price}}USTD</span>
            </p>
          </div>
          <div class="transfer_id">
            <h2>转账哈希</h2> 
            <input v-if="popType==1" type="text" v-model="pay_token" />
            <input v-if="popType==2" type="text" disabled v-model="pay_token" />
          </div>
          <div class="certificate">
            <h2>转账凭证</h2>
            <span>(*请上传转账交易记录截图凭证)</span>
            <div class="img_wrap">
              <div v-if="!pay_code">
                <div class="img_z" @click="choiceImg_z" v-show="!imgURL_z"></div>
                <img :src="imgURL_z" class="img3" ref="img1" @click="choiceImg_z" v-show="imgURL_z" />
                <input ref="imgz" type="file" accept="image/*" @change="getFile_z" />
              </div>
              <div v-else>
                <img :src="pay_code" class="img3" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div @click="paynow" v-if="popType==1" class="pay_btn">我已支付</div>
    </div>
  </div>
</template>
<script>
import util from "../../utils/util";

import QRCode from "qrcodejs2";
import {
  getAuthInfo,
  orderList,
  confirmOrder,
  transferInfo,
  orderInfo,
  orderPay,
  cancelOrder,
  getUserInfo
} from "../../service/api.js"; //接口
export default {
  data() {
    return {
      popType: 1,
      popFlag: false,
      permissionData: {},
      current: "",
      checked_price: "",
      order_current: 1,
      order_id: 0,
      total: 0,
      limit: 10,
      page: 1,
      address: "16oCXTimFcrrDmSWqkNQJjVRCMF6HyMmMW",
      imgURL_z: "",
      order_sn: "",
      auth_type: "",
      goods_price: "",
      status: "",
      authInfo: "",
      pay_token: "",
      pay_code: "",
      orders: [],
      is_real: 1,
      showNow: false,
      showqr: false
    };
  },
  computed: {},
  created() {
    this._getUserInfo();
    this._getAuthInfo();
    this._orderList();
    // this._transferInfo();
  },
  methods: {
    async _getUserInfo(index) {
      let res = await getUserInfo(this.$paramMd5([]));
      //console.log("_getUserInfo", res);
      if (res && res.code == 1) {
        this.is_real = res.data.is_real ? res.data.is_real : 1;
      } else {
        this.is_real = 1;
        // window.warn(res.message);
      }
      this.showNow = true;
    },
    onCopy() {
      window.success("复制成功");
    },
    // 复制失败
    onError() {
      window.success("复制失败");
    },
    qrcode(qr_code) {
      //console.log(qr_code);
      let qrcode = new QRCode("qrcode", {
        width: 150,
        height: 150,
        text: this.address ? this.address : "暂未设置"
      });
    },
    getQrcode() {
      if (!this.showqr) {
        this.showqr = true;
        this.$nextTick(() => {
          this.qrcode();
        });
      }
    },
    choiceImg_z() {
      this.$refs.imgz.click();
    },
    /**
     * 校验图片转换后大小并上传
     */
    checkAndHandleUpload(file, type) {
      let that = this;
      let uploadSrc = "";
      let uploadFile = "";
      this.imgBase64(file, function(image, canvas) {
        var maxSize = 2 * 1024; // 2M
        var fileSize = file.size / 1024; // 图片大小

        if (fileSize > maxSize) {
          // 如果图片大小大于2m，进行压缩
          //console.log(maxSize, fileSize, maxSize / fileSize);
          uploadSrc = canvas.toDataURL(file.type, maxSize / fileSize);
          uploadFile = that.convertBase64UrlToFile(
            uploadSrc,
            file.name.split(".")[0]
          ); // 转成file文件
        } else {
          uploadSrc = image.src; //canvas.toDataURL(file.type,0.5);
          uploadFile = file;
        }

        // var compressedSize = uploadFile.size / 1024 / 1024;
        // if (compressedSize.toFixed(2) > 2.0) {
        //   that.checkAndHandleUpload(uploadFile);
        // } else {
          // document.getElementById('previewImage').src = uploadSrc;
          if (type && type == 1) {
            that.$refs.img1.src = uploadSrc;
            that.imgURL_z = uploadSrc;
          } else {
            that.$refs.img2.src = uploadSrc;
            that.imgURL_f = uploadSrc;
            //console.log("that.imgURL_f", that.imgURL_f);
          }
        //}
      });
    },
    convertBase64UrlToFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    /**
     * 将图片转化为base64
     */
    imgBase64(file, callback, type) {
      var self = this;
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;
      // 创建一个 Image 对象
      var image = new Image();
      if (/^image/.test(file.type)) {
        // 创建一个reader
        var reader = new FileReader();
        // 将图片将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onload = function() {
          // self.imgUrls.push(this.result);
          // 设置src属性，浏览器会自动加载。
          // 记住必须先绑定事件，才能设置src属性，否则会出同步问题。
          image.src = this.result;
          //  if(type && type ==1){
          //     that.$refs.img1.src = uploadSrc;
          //     that.imgURL_z = uploadSrc;
          //     console.log('that.imgURL_z',that.imgURL_z);
          // }else{
          //     that.$refs.img2.src =  uploadSrc;
          //     that.imgURL_f =  uploadSrc;
          //      console.log('that.imgURL_f',that.imgURL_f);
          // }
          // 绑定 load 事件处理器，加载完成后执行
          image.onload = function() {
            // 获取 canvas DOM 对象
            var canvas = document.createElement("canvas");
            // 返回一个用于在画布上绘图的环境, '2d' 指定了您想要在画布上绘制的类型
            var ctx = canvas.getContext("2d");
            // 如果高度超标 // 参数，最大高度
            var MAX_HEIGHT = 1500;
            if (image.height > MAX_HEIGHT) {
              // 宽度等比例缩放 *=
              image.width *= MAX_HEIGHT / image.height;
              image.height = MAX_HEIGHT;
            }
            // 获取 canvas的 2d 环境对象,
            // 可以理解Context是管理员，canvas是房子
            // canvas清屏
            //console.log("canvas.width:", canvas.width);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // 重置canvas宽高
            canvas.width = image.width;
            canvas.height = image.height;
            // 将图像绘制到canvas上
            ctx.drawImage(image, 0, 0, image.width, image.height);
            // !!! 注意，image 没有加入到 dom之中
            //console.log(file.type);
            // console.log(canvas.toDataURL('image/jpeg',0.5));
            //----------//

            callback(image, canvas);
            //--------//
          };
        };
      }
    },
    getFile_z() {
      var that = this;
      const inputFile = this.$refs.imgz.files[0];
      if (inputFile) {
        if (
          inputFile.type !== "image/jpeg" &&
          inputFile.type !== "image/png" &&
          inputFile.type !== "image/gif"
        ) {
          window.warn("不是有效的图片文件！");
          return;
        }
        this.checkAndHandleUpload(inputFile, 1);
        // const reader = new FileReader();
        // reader.readAsDataURL(inputFile);
        // reader.onload = function(e) {
        //   that.$refs.img1.src = this.result;
        //   that.imgURL_z = this.result;
        //   console.log("that.imgURL_z", that.imgURL_z);
        // };
      } else {
        return;
      }
    },
    closePop() {
      this.popFlag = false;
      this.pay_token = "";
      this.pay_code = "";
    },
    showPop() {
      this.popFlag = true;
    },

    //取消订单
    async cancelOrder(id) {
      await this._getUserInfo();
      if (this.is_real == 0) {
        window.warn("请先进行实名认证");
        return;
      }
      if (this.is_real && this.is_real == 1) {
        window.warn("正在实名认证中...");
        return;
      }
      if (this.is_real && this.is_real == 3) {
        window.warn("实名实名认证失败");
        return;
      }
      let res = await cancelOrder(this.$paramMd5([`order_id=${id}`]));
      if (res && res.code == 1) {
        window.success("取消成功");
        this.order_tab(1);
      } else {
        window.warn(res.message);
      }
    },
    //支付订单
    async payOrder(item) {
      await this._getUserInfo();

      if (this.is_real == 0) {
        window.warn("请先进行实名认证");
        return;
      }
      if (this.is_real && this.is_real == 1) {
        window.warn("正在实名认证中...");
        return;
      }
      if (this.is_real && this.is_real == 3) {
        window.warn("实名实名认证失败");
        return;
      }
      if (this.is_real && this.is_real != 2) {
        window.warn("未实名认证");
        return;
      }
      this.popType = 1;
      await this._transferInfo();
      await this._orderInfo(item.order_id);
      this.pay_token = "";
      this.pay_code = "";
      this.imgURL_z = "";
      this.imgURL_f = "";
      this.popFlag = true;
    },
    //订单详情
    async detailOrder(item) {
      await this._getUserInfo();
      if (item && item.order_status != 1) {
        this.popType = 2;
        await this._transferInfo();
        await this._orderInfo(item.order_id);
        this.popFlag = true;
      }
    },
    //会员权限时间
    async _getAuthInfo() {
      let res = await getAuthInfo(this.$paramMd5([]));
      if (res && res.code == 1) {
        this.permissionData = res.data;
        this.current = res.data.seven_day;
        this.checked_price = res.data.seven_day_price;
      } else {
        window.warn(res.message);
      }
    },
    //凭证上传
    async paynow() {
      if(!this.showNow){
        return;
      }
      // order_id	订单id	字符串(string)	是
      // pay_token	转账的哈希地址	字符串(string)	是
      // pay_code	转账的凭证
      if (this.is_real == 0) {
        window.warn("请先进行实名认证");
        return;
      }
      if (this.is_real && this.is_real == 1) {
        window.warn("正在实名认证中...");
        return;
      }
      if (this.is_real && this.is_real == 3) {
        window.warn("实名实名认证失败");
        return;
      }

      if (!this.imgURL_z) {
        window.warn("请上传凭证");
        return;
      }
      if (!this.pay_token) {
        window.warn("请填写转账哈希");
        return;
      }

      let res = await orderPay(
        this.$paramMd5([
          `order_id=${this.order_id}`,
          `pay_token=${this.pay_token}`,
          `pay_code=${this.imgURL_z}`
        ])
      );
      if (res && res.code == 1) {
        this.popFlag = false;
        window.success("上传成功");
        this.order_tab(2);
      } else {
        window.warn(res.message);
      }
    },
    //转账地址
    async _transferInfo() {
      let res = await transferInfo(this.$paramMd5([]));
      if (res && res.code == 1) {
        this.address = res.data.set_address;
        this.getQrcode();
      } else {
        window.warn(res.message);
      }
    },
    async _orderInfo(id) {
      let res = await orderInfo(this.$paramMd5([`order_id=${id}`]));
      if (res && res.code == 1 && res.data) {
        // order_id	订单id	字符串(string)
        // order_sn	订单编号	字符串(string)
        // auth_type	权限类型	字符串(string)
        // goods_price	权限价格	字符串(string)
        // status	订单的操作日志	字符串(json)		"status":[{"order_id":623,"add_time":"2019-09-28 11:43:50","descri":"生成订单!"},{"order_id":623,"add_time":"2019-09-28 11:45:24","descri":"上传订单支付凭证！"}]
        // authInfo	权限详情(包含收款二维码)	字符串(string)		{"id":3,"set_address":"mojoajsodjoai","set_address_code":"http:\/\/www.hedgeadmin.com\/public\/upload\/auth_price\/2019\/09-20\/553a9be2e5539fcad34c0ef46ecdb5b1.jpeg"}
        // pay_token	付款地址，未付款时候为空	字符串(string)
        // pay_code	付款凭证，未付款时候凭证为空	字符串(str

        this.order_id = res.data.order_id;
        this.order_sn = res.data.order_sn;
        this.auth_type = res.data.auth_type;
        this.goods_price = res.data.goods_price;
        this.status = res.data.status;
        this.authInfo = res.data.authInfo;
        this.pay_token =
          res.data.order_status &&
          (res.data.order_status == 2 || res.data.order_status == 3)
            ? res.data.pay_token
            : "";
        this.pay_code =
          res.data.order_status &&
          (res.data.order_status == 2 || res.data.order_status == 3)
            ? res.data.pay_code
            : "";
      } else {
        window.warn(res.message);
      }
    },
    //我的订单
    async _orderList() {
      let res = await orderList(
        this.$paramMd5([
          `type=${this.order_current}`,
          `page=${this.page}`,
          `limit=${this.limit}`
        ])
      );
      if (res && res.code == 1) {
        this.orders = res.data.data;
        this.total = res.data.total;
        // this.limit = res.data.limit
        // this.total = res.data.total
      } else {
        window.warn(res.message);
      }
    },
    //下單
    async _confirmOrder() {
      if(!this.showNow){
        return;
      }
      // console.log(this.checked_price);
      // this.current = day;
      //   this.checked_price = price;
      await this._getUserInfo();
      this.pay_token = "";
      this.pay_code = "";
      this.imgURL_z = "";
      this.imgURL_f = "";
      if (this.is_real == 0) {
        window.warn("请先进行实名认证");
        return;
      }
      if (this.is_real && this.is_real == 1) {
        window.warn("正在实名认证中");
        return;
      }
      if (this.is_real && this.is_real == 3) {
        window.warn("实名实名认证失败");
        return;
      }
      let res = await confirmOrder(
        this.$paramMd5([
          `auth_type=${this.current}`,
          `auth_price=${this.checked_price}`
        ])
      );
      if (res && res.code == 1) {
        // this._orderInfo(res.data.order_id);
        window.success("购买成功");
        this.order_tab(1);
      } else {
        window.warn(res.message);
      }
    },
    async pageEvent(index) {
      if(!this.showNow){
        return;
      }
      let i = index ? index : 1;
      let res = await orderList(
        this.$paramMd5([
          `type=${this.order_current}`,
          `page=${i}`,
          `limit=${this.limit}`
        ])
      );
      if (res && res.code == 1) {
        this.orders = res.data.data;
        this.total = res.data.total;
        // this.limit = res.data.limit
        // this.total = res.data.total
      } else {
        window.warn(res.message);
      }
    },

    order_tab(index) {
      if(!this.showNow){
        return;
      }
      this.order_current = index;
      // 1待付款，2待确认，3已完成
      this._orderList();
    },
    //选择会员权限时间
    async checked_time(day, price) {
      if(!this.showNow){
        return;
      }
      this.current = day;
      this.checked_price = price;
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/less/mixin.less";
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
input {
  font-size: 14px;
  padding-left: 5px;
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
  min-width: 460px;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
  border-radius: 10px;
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
.img_wrap {
  margin-bottom: 20px;
  > p {
    height: 14px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(83, 105, 118, 1);
    line-height: 14px;
  }
  > div {
    position: relative;
    margin: 20px 0 0 0px;
    // width: 402px;
    width: 100%;
    height: 167px;
    border: 1px solid rgba(78, 98, 113, 1);
    margin-left: 20px;
    .img_z {
      width: 69px;
      height: 58px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      background: url("../../assets/img/shangchuan@2x2.png") no-repeat;
      background-size: 69px 58px;
      cursor: pointer;
    }
    > img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      border: 0;
      object-fit: cover;
      position: absolute;
      margin: auto;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: 2;
    }
    input {
      position: absolute;
      // left: 0;
      // top: 0;
      // bottom: 0;
      // right: 0;
      height: 1px;
      width: 400px;
      background: none;
      opacity: 0;
      z-index: 1;
    }
  }
}
.table_wrap {
  // min-width: 500px;
  height: calc(100% - 58px);
  // padding: 0px 40px 20px 40px;
  overflow-y: scroll;
  margin-top: 20px;
  .table_t {
    // min-width: 500px;
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
    // min-width: 500px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #cccccc;

    p {
      flex: 1;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(83, 105, 118, 1);
      height: 66px;
      line-height: 66px;
      padding: 0;
    }
  }
}
.member {
  margin-top: 30px;
  padding: 20px;
  > p {
    padding-left: 20px;
    height: 14px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(78, 98, 113, 1);
  }
  .time_select {
    width: 400px;
    margin-left: 40px;
    > div {
      width: 158px;
      height: 38px;
      border: 1px solid rgba(0, 185, 159, 1);
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(0, 185, 159, 1);
      line-height: 40px;
      margin-left: 40px;
      margin-top: 20px;
      float: left;
      text-align: center;
      cursor: pointer;
      &.active {
        background: rgba(0, 185, 159, 1);
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
.cost {
  margin-top: 40px;
  padding: 20px;
  > p {
    padding-left: 20px;
    height: 14px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(78, 98, 113, 1);
  }
  > div {
    margin-left: 80px;
    margin-top: 20px;
  }
  > .price {
    max-width: 358px;
    height: 38px;
    border: 1px solid rgba(83, 105, 118, 1);
    text-align: center;
    line-height: 38px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(83, 105, 118, 1);
  }
  .submit_btn {
    max-width: 360px;
    height: 40px;
    background: rgba(0, 185, 159, 1);
    text-align: center;
    line-height: 40px;
    margin-left: 80px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
  }
}
.order_tab {
  > div {
    width: 80px;
    height: 38px;
    border: 1px solid rgba(0, 185, 159, 1);
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(0, 185, 159, 1);
    line-height: 38px;
    margin-left: 40px;
    margin-top: 20px;
    float: left;
    text-align: center;
    cursor: pointer;
    &.order_active {
      background: rgba(0, 185, 159, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
}
.order_list_wrap {
  // width: 680px;
  margin: 30px auto;
  height: auto;
  padding: 20px;
  > .order_list {
    // width: 680px;
    height: 100px;
    background: #E3F8FE;
    border-radius: 5px;
    padding: 9px 20px 20px 20px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .order_list_l {
      > p:nth-child(1) {
        height: 14px;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(102, 102, 102, 1);
        line-height: 14px;
        > span {
          display: inline-block;
          height: 14x;
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          line-height: 14px;
          margin-right: 11px;
        }
      }
      > p:nth-child(2) {
        height: 14px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(0, 185, 159, 1);
        line-height: 14px;
        margin-top: 19px;
        span {
          margin-right: 31px;
        }
      }
      > p:nth-child(3) {
        height: 14px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(0, 185, 159, 1);
        line-height: 14px;
        margin-top: 10px;
        span {
          margin-right: 31px;
        }
      }
    }
    .order_list_r {
      > p:nth-child(1) {
        height: 14px;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(102, 102, 102, 1);
        line-height: 14px;
        text-align: right;
      }
      .no_pay {
        width: 200px;
        display: flex;
        justify-content: space-between;
        margin-top: 25px;
        > div:nth-child(1) {
          width: 78px;
          height: 28px;
          line-height: 28px;
          border: 1px solid rgba(102, 102, 102, 1);
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(102, 102, 102, 1);
          text-align: center;
          cursor: pointer;
        }
        > div:nth-child(2) {
          width: 80px;
          height: 30px;
          line-height: 30px;
          background: rgba(0, 185, 159, 1);
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
}
.pop {
  width: 760px;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  box-shadow: 4px 4px 5px 4px rgba(6, 0, 1, 0.05);
  // max-height: calc(100% - 140px);
  // overflow-y: scroll;
  padding-top: 42px;
  overflow: hidden;
  overflow-y: scroll;
  > h2 {
    height: 18px;
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #1E47A6;
    line-height: 18px;
    text-align: center;
    margin-bottom: 20px;
  }
  .order_detail {
    display: flex;
    .transfer {
      width: 400px;
      padding-left: 40px;
      h2 {
        height: 36px;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(83, 105, 118, 1);
        line-height: 36px;
      }
      .QR_code {
        margin-top: 20px;
        margin-left: 20px;
        width: 300px;
        height: 480px;
        background: url("../../assets/img/invite_1.png") no-repeat center;
        background-size: 300px 480px;
        .qr_wrap {
          padding-top: 25px;
          padding-left: 25px;
          width: 200px;
          height: 200px;
          background: url("../../assets/img/invite_2.png") no-repeat center;
          background-size: 200px 200px;
          position: relative;
          top: 120px;
          left: 50px;
        }
      }
      .receipt_id {
        width: 300px;
        margin-left: 20px;
        margin-top: 20px;
        height: 40px;
        display: flex;
        justify-content: start;
        p:nth-child(1) {
          width: 65px;
          height: 40px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(83, 105, 118, 1);
          line-height: 40px;
        }
        p:nth-child(2) {
          width: 179px;
          height: 40px;
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          word-break: normal;
          line-height: 16px;
          word-wrap: break-word;
          padding-top: 10px;
        }
        span {
          width: 55px;
          height: 20px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(0, 185, 159, 1);
          line-height: 20px;
          margin-top: 20px;
          text-align: right;
          cursor: pointer;
        }
      }
    }
    .order {
      width: 320px;
      .order_status,
      .order_info,
      .transfer_id,
      .certificate {
        h2 {
          height: 36px;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(83, 105, 118, 1);
          line-height: 36px;
          margin-top: 20px;
        }
        span {
          color: #666;
          font-size: 14px !important;
        }
      }
      .order_status > h2 {
        margin-top: 0px !important;
      }
      .order_status {
        .wrap {
          max-height: 200px;
          overflow: hidden;
          overflow-y: scroll;
        }
        .list {
          margin-left: 20px;
          div {
            min-width: 60px;
            min-height: 30px;
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            color: rgba(83, 105, 118, 1);
            line-height: 30px;
          }
          // span:nth-child(1) {
          //   margin-right: 20px;
          // }
        }
      }
      .order_info {
        p {
          margin-left: 20px;
          span {
            width: 60px;
            height: 14px;
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            color: rgba(83, 105, 118, 1);
            line-height: 36px;
          }
          span:nth-child(1) {
            margin-right: 20px;
          }
        }
      }
      .transfer_id {
        > input {
          width: 260px;
          height: 30px;
          border: 1px solid rgba(78, 98, 113, 1);
          margin-left: 20px;
        }
      }
    }
  }
}
.pay_btn {
  width: 360px;
  height: 40px;
  background: rgba(0, 185, 159, 1);
  margin: 30px auto;
  text-align: center;
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  line-height: 40px;
  cursor: pointer;
}
.shade {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: black;
  opacity: 0.7;
}
</style>
