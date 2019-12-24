<style lang="less" scoped>
@import "../assets/less/global.less";
@import "../assets/less/mixin.less";
span:nth-child(1) {
  animation: blink 1s steps(1, start) 0.33s infinite;
}

span:nth-child(2) {
  animation: blink 1s steps(1, start) 0.66s infinite;
}

span:nth-child(3) {
  animation: blink 1s steps(1, start) 0.33s infinite;
}

span:nth-child(4) {
  animation: blink 1s steps(1, start) 0.66s infinite;
}

span:nth-child(5) {
  animation: blink 1s steps(1, start) 0.33s infinite;
}

span:nth-child(6) {
  animation: blink 1s steps(1, start) 0.66s infinite;
}

@keyframes blink {
  10% {
    color: #ff4057;
  }
  10% {
    color: rgb(233, 255, 32);
  }
  10% {
    color: rgb(87, 14, 223);
  }
  10% {
    color: rgb(255, 32, 181);
  }
  60% {
    color: #ff8260;
  }
}

header {
  font-family: "Microsoft YaHei";
  font-size: 14px;
  background-color: @header-color;

  -webkit-app-region: drag;
  .left {
    float: left;
    margin-left: 8px;
  }
  .green {
    color: aquamarine !important;
  }
  .red {
    color: red !important;
  }
  .info {
    float: right;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    margin-right: 84px;
    -webkit-app-region: no-drag;
    position: relative;
    z-index: 0;
    cursor: pointer;
    &.green {
      color: green !important;
    }
    .exit {
      width: 180px;
      height: 160px;
      background: rgba(255, 255, 255, 1);
      border-radius: 5px;
      box-shadow: 4px 4px 5px 0px rgba(3, 5, 1, 0.05);
      text-align: center;
      position: absolute;
      padding-top: 20px;
      top: 60px;
      left: 0;
      > img {
        width: 43px;
        height: 43px;
      }
      > .user {
        height: 17px !important;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #1E47A6;
        line-height: 17px !important;
        overflow: hidden;
      }
      .exit_btn {
        height: 17px !important;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 16px !important;
        margin-top: 20px;
      }
    }
    .ivu-tooltip {
    }
  }
  .right {
    float: right;
    display: flex;

    .items {
      flex: 1;
      cursor: pointer;
    }
    a {
      -webkit-app-region: no-drag;
      color: #000;
      margin-right: 10px;
    }
  }
  .icon-minus {
    display: inline-block;
    margin: 0 auto;
    width: 15px;
    height: 15px;
    overflow: hidden;
    vertical-align: middle;
    margin-top: 10px;
    background-size: 100%;
    background-repeat: no-repeat;
    .bg-image("../img/l_shouqi");
  }
  .icon-max {
    display: inline-block;
    margin: 0 auto;
    width: 15px;
    height: 15px;
    overflow: hidden;
    vertical-align: middle;
    margin-top: 1px;
    background-size: 100%;
    background-repeat: no-repeat;
    .bg-image("../img/l_zuidahua");
  }
  .icon-close {
    display: inline-block;
    margin: 0 10px 0 0;
    width: 15px;
    height: 15px;
    overflow: hidden;
    vertical-align: middle;
    margin-top: -2px;
    background-size: 100%;
    background-repeat: no-repeat;
    .bg-image("../img/l_guanbi");
  }
  .icon-touxiang {
    display: inline-block;
    margin: 0 auto;
    width: 22px;
    height: 22px;
    vertical-align: middle;
    background-size: 100%;
    background-repeat: no-repeat;
    .bg-image("../img/touxiang");
  }
}
</style>

<template>
  <header @dblclick="reWindows">
    <section class="right">
      <div class="items" @click="minWindows">
        <a href="javascript:void(0)">
          <i class="icon-minus"></i>
        </a>
      </div>
      <div class="items" @click="reWindows">
        <a href="javascript:void(0)">
          <i class="icon-max"></i>
        </a>
      </div>
      <div class="items" @click="closeWindows">
        <a href="javascript:void(0)">
          <i class="icon-close"></i>
        </a>
      </div>
    </section>
    <section
      class="info red"
      :class="{green:mainStatus}"
      @mouseenter="enter()"
      @mouseleave="leave()"
    >
      对冲状态：{{mainStatus?'':''}}
      <span v-if="mainStatus">正</span>
      <span v-if="mainStatus">在</span>
      <span v-if="mainStatus">对</span>
      <span v-if="mainStatus">冲</span>
      <span v-if="mainStatus">中</span>

      <i v-if="!mainStatus">对</i>
      <i v-if="!mainStatus">冲</i>
      <i v-if="!mainStatus">已</i>
      <i v-if="!mainStatus">停</i>
      <i v-if="!mainStatus">止</i>
    </section>
    <section class="info" @mouseenter="enter()" @mouseleave="leave()">
      <i class="icon-touxiang"></i>
      剩余天数：{{userInfo.auth}}
      <div class="exit" v-show="showFlag">
        <img src="../assets/img/touxiang@2x.png" alt />
        <p class="user">{{userInfo.user_name}} ({{userInfo.level_type}})</p>
        <p class="exit_btn" @click="exit">退出</p>
      </div>
    </section>
  </header>
</template>
<script>
import { swithStatus, openMain, closeMain } from "../controller/common";
import Bus from "@/utils/bus";
import { removeToken, removeUserInfo, sleep } from "@/utils/common";
import { loginout, getUserInfo } from "@/service/api";
import packageJson from "../../../package.json";
const { ipcRenderer } = require("electron");
export default {
  data() {
    return {
      currentVersion: packageJson.version,
      updateText: "",
      downloadProgress: null,
      downloadInfo: {
        percent: null,
        totalMB: 0,
        KBPerSecond: 0
      },
      updateModalShow: false,
      updateInfo: {
        releaseName: "",
        releaseNotes: "",
        releaseDate: "",
        version: ""
      },
      leftDays: "365天",
      showFlag: false,
      mainStatus: false,
      userInfo: this.$getUserInfo()
    };
  },
  methods: {
    async _getUserInfo(index) {
      await sleep();
 
      let res = await getUserInfo(this.$paramMd5([]));
 
      if (res && res.code == 1) {
        // this.auth = res.data.auth ? res.data.auth : "暂无";
        this.userInfo = res.data;
      } else {
        // window.warn(res.message);
      }
    },
    minWindows() {
      this.$electron.ipcRenderer.send("min-window");
    },
    maxWindows() {
      this.$electron.ipcRenderer.send("max-window");
    },
    reWindows() {
      this.$electron.ipcRenderer.send("reMax-window");
    },
    closeWindows() {
      let mainCheck = localStorage["mainCheck"];
      mainCheck = mainCheck != "undefined" && mainCheck == "1" ? true : false;
      this.mainStatus = mainCheck;
      let content = "<p></p>";
      if (mainCheck) {
        content = "<p>当前正在对冲中，退出程序将中止对冲</p>";
      }
      this.$Modal.confirm({
        title: "确定要离开程序吗？",
        content: content,
        onOk: async () => {
            Bus.$emit("logout") 
          if (
            localStorage["mainCheck"] != undefined &&
            localStorage["mainCheck"] == "1"
          ) {
            localStorage["mainCheck"] = "0";
            await closeMain();
            await sleep(2000);
            this.$electron.ipcRenderer.send("exitw", "msg");
            this.$electron.ipcRenderer.send("mainCheck", "msg");
            await sleep(1000);
            Bus.$emit("logoutEnd")
          } else {
            localStorage["mainCheck"] = "0";
            await closeMain();
            await sleep(2000);
            this.$electron.ipcRenderer.send("mainCheck", "msg");
            this.$electron.ipcRenderer.send("close-window");
            await sleep(1000);
            Bus.$emit("logoutEnd")
          }
 
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel');
        }
      });
    },
    showUpdateModal() {
      this.updateModalShow = true;
    },
    updateConfirm() {
      this.updateModalShow = false;
      this.$electron.ipcRenderer.send("update-now");
    },
    closeUpdateModal() {
      this.updateModalShow = false;
      this.updateText = "更新已取消";
    },
    enter() {
      this.showFlag = true;
    },
    leave() {
      this.showFlag = false;
    },
    async exit() {
      let mainCheck = localStorage["mainCheck"];
      mainCheck = mainCheck != "undefined" && mainCheck == "1" ? true : false;
      this.mainStatus = mainCheck;
      let content = "<p></p>";
      if (mainCheck) {
        content = "<p>当前正在对冲中，退出程序将中止对冲</p>";
      }
      this.$Modal.confirm({
        title: "退出登录并撤销当前所有挂单？",
        content: content,
        onOk: async () => {
          Bus.$emit("logout")
          if (
            localStorage["mainCheck"] != undefined &&
            localStorage["mainCheck"] == "1"
          ) {
            localStorage["mainCheck"] = "0";
            await closeMain();
            await sleep(2000);
            this.$electron.ipcRenderer.send("exitNow", "msg");
            await sleep(1000);
            Bus.$emit("logoutEnd")
          } else {
            localStorage["mainCheck"] = "0";    
            await closeMain();
            await sleep(2000);
            await loginout(this.$paramMd5([]));
            removeToken();
            removeUserInfo();
            this.$electron.ipcRenderer.send("exitNow", "msg");
            this.$removeUserInfo();
            this.$router.push("/");
            await sleep(1000);
            Bus.$emit("logoutEnd")
          }
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel');
        }
      });
    },
    check() {
      let _this = this;

    }
  },
  created() {
    let _this = this;
    _this._getUserInfo();
    Bus.$on("mainCheck", target => {
      // console.log("Bus maincheck header");
      let mainCheck = localStorage["mainCheck"];
      mainCheck = mainCheck != "undefined" && mainCheck == "1" ? true : false;
      _this.mainStatus = mainCheck;

      if (_this.$getUserInfo() && _this.$getUserInfo().id) {
        _this._getUserInfo();
      }
    });

    this.$electron.ipcRenderer.on("exitwMsg", async (ev, message) => {
      _this.$electron.ipcRenderer.send("close-window");
    });
    this.$electron.ipcRenderer.on("exitNowMsg", async (ev, message) => {
      await loginout(this.$paramMd5([]));
      removeToken();
      removeUserInfo();
      ipcRenderer.send("mainCheck", "msg");
      _this.$removeUserInfo();
      _this.$router.push("/");
    });
    this.$electron.ipcRenderer.on("mainCheckMsg", (ev, message) => {
      // console.log("mainCheck----收到");
      let mainCheck = localStorage["mainCheck"];
      mainCheck = mainCheck != "undefined" && mainCheck == "1" ? true : false;
      _this.mainStatus = mainCheck;
      if (_this.$getUserInfo() && _this.$getUserInfo().id) {
        _this._getUserInfo();
      }
    });
  }
};
</script>
