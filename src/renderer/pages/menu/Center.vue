<template>
  <div class="content_box">
    <div class="left">
      <h2 @click="test">修改密码</h2>
      <div class="form_wrap">
        <div class="input_wrap">
          <p>请输入验证码</p>
          <div>
            <input type="text" class="yanzhen" maxlength="6" v-model="verifyCode" />
            <send-sms-or-email></send-sms-or-email>
            <!-- <p v-show="!msmFlag">{{wait_timer}}S</p>
            <p v-show="msmFlag" @click="sendMsg">{{send}}</p>-->
          </div>
        </div>
        <div class="input_wrap">
          <p>设置登录密码</p>
          <div>
            <input type="password" v-model="password" maxlength="16" />
          </div>
        </div>
        <div class="input_wrap">
          <p>确认登录密码</p>
          <div>
            <input type="password" v-model="password2" maxlength="16" />
          </div>
        </div>
        <div class="submitBtn" @click="setLoginPassword">提交</div>
      </div>
    </div>
    <div class="right">
      <h2>
        实名信息
        <span class="ing" v-if="is_real && is_real==1">（实名认证申请中）</span>
        <span class="done" v-if="is_real && is_real==2">（实名认证已通过）</span>
        <span class="red" v-if="is_real && is_real==3">（实名认证未通过）</span>
      </h2>

      <div class="form_wrap">
        <div class="input_wrap">
          <p>姓名</p>
          <div>
            <input
              v-if="!is_real || is_real==0 || is_real==3"
              type="text"
              maxlength="10"
              v-model="realName"
            />
            <input v-else disabled type="text" maxlength="10" v-model="realName" />
          </div>
        </div>
        <div class="input_wrap">
          <p>身份证号</p>
          <div>
            <input
              v-if="!is_real || is_real==0 || is_real==3"
              type="text"
              maxlength="18"
              v-model="idcard"
            />
            <input v-else disabled type="text" maxlength="18" v-model="idcard" />
          </div>
        </div>
        <div class="img_wrap">
          <p>上传身份证正面照:(请把身份证放到手写 “MBB认证专用” 的白纸上拍摄)</p>
          <div>
            <div class="bg1 img_z"></div>
            <div class="img_z" @click="choiceImg_z" v-show="showNow&&!imgURL_z"></div>
            <img :src="imgURL_z" class="img3" ref="img1" @click="choiceImg_z" v-show="imgURL_z" />
            <input
              v-if="!is_real || is_real==0 || is_real==3"
              ref="imgz"
              type="file"
              accept="image/*"
              @change="getFile_z"
            />
          </div>
        </div>
        <div class="img_wrap">
          <p>上传身份证背面照:(请把身份证放到手写 “MBB认证专用” 的白纸上拍摄)</p>
          <div>
            <div class="bg2 img_z"></div>
            <div class="img_z" @click="choiceImg_f" v-show="showNow&&!imgURL_f"></div>
            <img :src="imgURL_f" class="img3" ref="img2" @click="choiceImg_f" v-show="imgURL_f" />
            <input
              v-if="!is_real || is_real==0 || is_real==3"
              ref="imgf"
              type="file"
              accept="image/*"
              @change="getFile_f"
            />
          </div>
        </div>
        <div
          class="submitBtn"
          v-if="showNow&&(!is_real || is_real==0 || is_real==3)"
          @click="submit_userinfo"
        >提交</div>
      </div>
    </div>
  </div>
</template>
<script>
import sendSmsOrEmail from "../component/sendSmsOrEmail"; //发验证码
import util from "../../utils/util";
import {
  resetPassword,
  setNewPass,
  uploadSelfIdentity,
  getUserInfo,
  getUploadSelfIdentity
} from "../../service/api.js"; //接口

export default {
  data() {
    return {
      showNow: false,
      phone: "",
      verifyCode: "",
      password: "",
      password2: "",
      realName: "",
      idcard: "",
      idcard_front: "",
      idcard_back: "",
      imgURL_z: "",
      imgURL_f: "",
      is_real: 0
    };
  },
  components: {
    sendSmsOrEmail
  },
  created() {
    this.phone = this.$getUserInfo().phone;
    //console.log(this.$getUserInfo());
    this._getUserInfo();
  },
  mounted() {},
  methods: {
    async _getUserInfo(index) {
      let res = await getUserInfo(this.$paramMd5([]));
      //console.log("_getUserInfo", res);
      if (res && res.code == 1) {
        this.is_real = res.data.is_real ? res.data.is_real : 0;
      } else {
        this.is_real = 1;
        // window.warn(res.message);
      }
      if (this.is_real == 1 || this.is_real == 2) {
        let res2 = await getUploadSelfIdentity(this.$paramMd5([]));
        if (res2 && res2.code == 1) {
          //console.log(res2);
          this.realName = res2.data.name;
          this.idcard = res2.data.idcard;
          this.imgURL_z = res2.data.idcard_front;
          this.imgURL_f = res2.data.idcard_back;
        }
      }
      this.showNow = true;
    },
    test() {
      this.$Notice.error({
        title: "搜索失败",
        desc: 1
      });
    },
    choiceImg_z() {
      this.$refs.imgz && this.$refs.imgz.click();
    },
    choiceImg_f() {
      this.$refs.imgf && this.$refs.imgf.click();
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
     * 校验图片转换后大小并上传
     */
    checkAndHandleUpload(file, type) {
      let that = this;
      let uploadSrc = "";
      let uploadFile = "";
      let scale = 0.8;
      this.imgBase64(file, function(image, canvas) {
        var maxSize = 2 * 1024; // 2M
        var fileSize = file.size / 1024; // 图片大小
        //console.log("fileSize", fileSize);
        if (fileSize > maxSize) {
          // 如果图片大小大于2m，进行压缩
          // uploadSrc = canvas.toDataURL(file.type, 0.9);
          uploadSrc = canvas.toDataURL('image/jpeg', 0.9); //canvas.toDataURL(file.type, 0.9); 'image/png'格式压缩不了
          //目标是小于2兆
          while (uploadSrc.length > 1024 * 1024 * 2) {
            scale -= 0.05;
            //console.log("scale", scale,uploadSrc.length);
            uploadSrc = canvas.toDataURL('image/jpeg', scale);
          }

          uploadFile = that.convertBase64UrlToFile(
            uploadSrc,
            file.name.split(".")[0]
          ); // 转成file文件
        } else {
          uploadSrc = image.src; //canvas.toDataURL(file.type,0.5);
          uploadFile = file;
        }

        //var compressedSize = uploadFile.size / 1024 / 1024;
       // if (compressedSize.toFixed(2) > 2.0) {
          // that.checkAndHandleUpload(uploadFile);
       // } else {
          //console.log(123, uploadSrc);
          // document.getElementById('previewImage').src = uploadSrc;
          if (type && type == 1) {
            that.$refs.img1.src = uploadSrc;
            that.imgURL_z = uploadSrc;
            //console.log("that.imgURL_z", that.imgURL_z);
          } else {
            that.$refs.img2.src = uploadSrc;
            that.imgURL_f = uploadSrc;
            //console.log("that.imgURL_f", that.imgURL_f);
          }
        //}
      });
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
            var MAX_HEIGHT = 1000;
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
        //   console.log('that.imgURL_z',that.imgURL_z);
        // };
      } else {
        return;
      }
    },
    getFile_f() {
      var that = this;
      const inputFile = this.$refs.imgf.files[0];
      if (inputFile) {
        if (
          inputFile.type !== "image/jpeg" &&
          inputFile.type !== "image/png" &&
          inputFile.type !== "image/gif"
        ) {
          window.warn("不是有效的图片文件！");
          return;
        }
        this.checkAndHandleUpload(inputFile, 2);
        // const reader = new FileReader();
        // reader.readAsDataURL(inputFile);
        // reader.onload = function(e) {
        //   that.$refs.img2.src = this.result;
        //   that.imgURL_f = this.result;
        // };
      } else {
        return;
      }
    },
    // async sendMsg() {
    //   let res = await sendSms(
    //     this.$paramMd5([`phone=${this.phone}`, `type=2`])
    //   );
    //   if (res && res.code == 1) {
    //     this.wait_timer = 60;
    //     this.msmFlag = false;
    //     var timer_interval = setInterval(() => {
    //       if (this.wait_timer > 0) {
    //         this.wait_timer--;
    //       } else {
    //         this.msmFlag = true;
    //         this.send = "重新发送";
    //         clearInterval(timer_interval);
    //       }
    //     }, 1000);
    //   } else {
    //     window.warn(res.message);
    //   }
    // },
    async setLoginPassword() {
      if (this.verifyCode == "") {
        window.warn("验证码不能为空");
        return;
      }
      if (this.password == "") {
        window.warn("登录密码不能为空");
        return;
      }
      if (this.password.length < 6 || this.password.length > 12) {
        window.warn("请设置6-12位数字加字母登录密码");
        return;
      }

      if (this.password != this.password2) {
        window.warn("两次输入的密码不一致");
        return;
      }

      let res = "";
      //手机
      if (this.phone != "" && this.phone !== undefined) {
        res = await resetPassword(
          this.$paramMd5([
            `password=${this.password}`,
            `password2=${this.password2}`,
            `verifyCode=${this.verifyCode}`,
            `type=1`
          ])
        );
      } else {
        //邮箱
        res = await setNewPass(
          this.$paramMd5([
            `password=${this.password}`,
            `password2=${this.password2}`,
            `verifyCode=${this.verifyCode}`,
            `type=2`
          ])
        );
      }
      if (res && res.code == 1) {
        this.password = "";
        this.password2 = "";
        this.verifyCode = "";
        window.success(res.message);
      } else {
        window.warn(res.message);
      }
    },

    async submit_userinfo() {
      if (this.realName == "") {
        window.warn("请输入真实姓名");
        return;
      }
      if (this.idcard == "") {
        window.warn("请输入身份证号");
        return;
      }

      if (this.imgURL_z == "") {
        window.warn("请上传身份证正面照");
        return;
      }
      if (this.imgURL_f == "") {
        window.warn("请上传身份证反面照");
        return;
      }
      //console.log(this.imgURL_z);
      //console.log(this.imgURL_f);
      let res = await uploadSelfIdentity(
        this.$paramMd5([
          `realName=${this.realName}`,
          `idcard=${this.idcard}`,
          `idcard_front=${this.imgURL_z}`,
          `idcard_back=${this.imgURL_f}`
        ])
      );
      if (res && res.code == 1) {
        this.realName = "";
        this.idcard = "";
        this.imgURL_z = "";
        this.imgURL_f = "";
        this._getUserInfo();
        window.success(res.message);
      } else {
        window.warn(res.message);
      }
    }
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
  .left {
    width: 460px;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
    border-radius: 10px;
    h2 {
      margin-top: 20px;
      margin-left: 20px;
      height: 18px;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #1e47a6;
      line-height: 18px;
      margin-bottom: 30px;
    }
    .form_wrap {
      padding: 0px 20px 20px 20px;
      .input_wrap {
        // max-width:500px;
        display: flex;
        margin-bottom: 20px;
        > p {
          height: 40px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(83, 105, 118, 1);
          line-height: 40px;
          width: 100px;
        }
        > div {
          display: flex;
          justify-content: space-between;
          > input {
            width: 320px;
            height: 40px;
            background: #e3f8fe;
            border: none;
          }
          > p {
            width: 140px;
            height: 40px;
            background: rgba(0, 185, 159, 1);
            text-align: center;
            line-height: 40px;
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            margin-left: 20px;
            cursor: pointer;
          }
          .yanzhen {
            width: 160px !important;
          }
        }
      }
      .submitBtn {
        width: 320px;
        height: 40px;
        background: rgba(0, 185, 159, 1);
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        margin-left: 100px;
        cursor: pointer;
      }
    }
  }
  .right {
    width: 100%;
    height: 100%;
    margin-left: 20px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 4px 4px 5px 0px rgba(6, 0, 1, 0.05);
    border-radius: 10px;
    overflow-x: hidden;
    overflow-y: scroll;
    h2 {
      margin-top: 20px;
      margin-left: 20px;
      height: 18px;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #1e47a6;
      line-height: 18px;
      margin-bottom: 30px;
      span {
        font-size: 12px;
        color: #666666;
      }
      .red {
        color: rgb(212, 23, 33);
      }
      .ing {
        color: #1e47a6;
      }
      .done {
        color: #00b99f;
      }
    }
    .form_wrap {
      padding: 0px 20px 20px 20px;

      .input_wrap {
        // max-width:500px;
        display: flex;
        margin-bottom: 40px;
        width: 100%;
        box-sizing: border-box;
        > p {
          width: 80px;
          height: 40px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(83, 105, 118, 1);
          line-height: 40px;
        }
        > div {
          display: flex;
          justify-content: space-between;
          width: 100%;
          > input {
            width: 100%;
            // max-width:500px;
            height: 40px;
            background: #e3f8fe;
            border: none;
          }
        }
      }
      .img_wrap {
        margin-bottom: 20px;
        // max-width:300px;
        text-align: center;
        > p {
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(83, 105, 118, 1);
          line-height: 16px;
          text-align: left;
        }
        > div {
          position: relative;
          margin: 15px 0 0 0px;
          // width: 402px;
          // width: 100%;
          margin-left: 80px;
          height: 167px;
          border: 1px solid rgba(78, 98, 113, 1);
          .img_z {
            width: 69px;
            height: 58px;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            background: url("../../assets/img/shangchuan@2x.png") no-repeat
              center;
            background-size: 69px 58px;
            cursor: pointer;
            z-index: 9;
          }
          .bg1 {
            width: 100%;
            height: 100%;
            background: url("../../assets/img/shangchuan1.png") no-repeat center;
            background-size: auto 100%;
          }
          .bg2 {
            width: 100%;
            height: 100%;
            background: url("../../assets/img/shangchuan2.png") no-repeat center;
            background-size: auto 100%;
          }
          .bg1::before,
          .bg2::before {
            content: "";
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            position: absolute;
            z-index: 1;
            background: rgba(0, 0, 0, 0.3);
          }
          > img {
            // width: 400px;
            // width:  calc(100% - 2px);
            // // height: 165px;
            // height: 35%;
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
            z-index: 10;
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
      .submitBtn {
        margin-left: 80px;
        margin-top: 40px;
        cursor: pointer;
      }
    }
  }
}
</style>
