<template>
  <!--
    layout包在最外侧，里面包含menu左侧导航栏和content右侧内容(包含顶部区域和内容区域)部分
    is_collapse变量定义为判断左侧导航栏是否缩进
    引入menu和content的components，并进行显示
  -->
  <div class="layout">  
    <div class="menu">   
      <!--
        定义响应式变量和注册事件
      -->
      <Menu :is_collapse="is_collapse" @changeMenu="changeMenu"></Menu> 
    </div>
    <!--
      此处class="{small:is_collapse}"，使class能够随着is_collapse的变化而变化，is_collapse为真，则class则会用small覆盖掉content，显示small的格式
    -->
    <div class="content" :class="{small:is_collapse}">
      <Content :is_collapse="is_collapse"></Content>
    </div>
    </div>
</template>

<script>
import Menu from './menu/menu-index.vue'
import Content from './content/content-index.vue'
export default {
  components:{
    Menu,
    Content
  },
  data(){
    return{
      //is_collapse默认为假，即不缩进
      is_collapse:false
    }
  },
  methods:{
    changeMenu(){
        this.is_collapse=!this.is_collapse;
      }
  }
}
</script>

<style lang="less" scoped>

.layout{
  display: flex;
  
  .menu{
    z-index: 9999;
    background: #091527;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;

  }

  .content{
    padding-left:200px;
    transition: padding-left 0.43s;
    width:90%;
  }
  .small{
    padding-left: 64px;
    width:100%;
  }
  //font-family: "仿宋","Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",Arial,sans-serif;
}
</style>