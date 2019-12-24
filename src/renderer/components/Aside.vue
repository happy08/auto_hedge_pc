<style lang='less'>
@import '../assets/less/global.less';
aside {
  position: relative;
  background-color: @aside-color;
  box-shadow: 0 0 7px #000;
  // -webkit-app-region: drag;
  background:linear-gradient(0deg,#2C68C3 0%,#163595 100%);
  .title {
    -webkit-app-region: drag;
    padding-top: 20px;
    margin-bottom: 40px;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 36px;
    background:rgba(201, 214, 255, 0);
  }
  

}

.aboutText {
  p {
    line-height: 26px;
  }
}

.psText {
  margin-top: 20px;
}
</style>

<template>
  <aside>
    <div class='title'>移动积木（V1.1.0）</div>
    <Menu ref='menu'
      @on-select='selectMenu'
      theme='dark'
      width='100%'
      :active-name='activeMenuName'
      accordion
      class='layout-menu-left'>
      <Menu-item v-for='(menu, index) in MENU' :name='menu.path' :key='index'>
        <div class='left'>
          <p>{{menu.title}}</p>
        </div>
      </Menu-item>
    </Menu>
  </aside>
</template>

<script>
import MENU from '../menu';
import packageJson from '../../../package.json';
import { docDir } from '../utils/settings';

export default {
  data() {
    return {
      MENU,
      activeMenuName: '',
      modalShow: false,
      version: packageJson.version,
      docDir
    };
  },
  methods: {
    selectMenu(path) {
      this.$router.push({ path });
    },
    dropMenuClick(name) {
      switch (name) {
        case 'update':
          //console.log('check update');
          break;
        case 'about':
          this.modalShow = true;
          break;
        default:
           console.log('check update');;
      }
    },
    openUrl(url) {
      this.$electron.shell.openExternal(url);
    },
    openPath(path) {
      this.$electron.shell.openItem(path);
    }
  },
  watch: {
    $route() {
      this.activeMenuName = this.$route.path;
      this.$nextTick(() => {
        this.$refs.menu.updateActiveName();
      });
    }
  },
  created() {
    this.selectMenu(MENU[0].path);
    this.activeMenuName = this.$route.path;
    this.$nextTick(() => {
      this.$refs.menu.updateActiveName();
    });
  }
};
</script>

