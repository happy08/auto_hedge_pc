<template>
    <div class="home-background theme-color1">
        <Header class="header"></Header>
        <Aside class="aside"></Aside>
        <div class="container">
            <transition name="slide-fade" mode="out-in" >  <!-- -->
            <router-view class="clearfix"></router-view>
            </transition>
        </div>
    </div>
</template>
<script>
import Aside from '../components/Aside.vue';
import Header from '../components/Header.vue';

export default {
  data() {
    return {};
  },
  components: {
    Aside,
    Header,
  },
};
</script>
<style lang="less" scoped>
    @import "../assets/less/global.less";
.slide-fade-enter-active {
  transition: all .9s ease;
}    
.slide-fade-leave-active {
  transition: all .6s ease;
}
.slide-fade-enter
{
 transform: translateX(-20px);
 opacity:0;
}
.slide-fade-leave-to{
  transform: translateX(-50px);
  opacity: 0;
}

    .home-background {
        position: relative;
        background-color: @bg-color;
        overflow-x: hidden;
        overflow-y: auto;
        .header {
            position: absolute;
            top: 0;
            left: @view-left;
            right: 0;
            height: 60px;
            line-height: 60px;
            z-index: 99;
        }
        .aside {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: @view-left;
        }
        .container {
            position: absolute;
            top: 60px;
            right: 0;
            left: @view-left;
            bottom: 0;
            overflow: auto;
            padding: @view-padding;
        }
    }
</style>
