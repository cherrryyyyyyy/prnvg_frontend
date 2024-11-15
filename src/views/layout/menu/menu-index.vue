<template>
  <div>
    <!--
        左侧导航栏设计，使用element-ui组件
      -->
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" background-color="#091527" text-color="#fff"
      active-text-color="#ffd04b" router :collapse="is_collapse">
      <el-menu-item index>
        <!--
          changeMenu为调整缩放函数，绑定在click事件上，在methods中对changeMenu进行定义
        -->
        <i class="el-icon-s-operation" @click="changeMenu"></i>
        <span slot="title">威胁狩猎系统</span>
      </el-menu-item>
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">主页</span>
      </el-menu-item>
      <el-menu-item index="/alert/index">
        <i class="el-icon-bell"></i>
        <span slot="title">告警</span>
      </el-menu-item>
      <el-menu-item index="/dashboard/index">
        <i class="el-icon-pie-chart"></i>
        <span slot="title">仪表盘</span>
      </el-menu-item>
      <el-menu-item index="/case/index">
        <i class="el-icon-postcard"></i>
        <span slot="title">事件</span>
      </el-menu-item>
      <el-menu-item index="/danger/index">
        <i class="el-icon-aim"></i>
        <span slot="title">行为详情</span>
      </el-menu-item>
      <el-menu-item index="/matrix/index">
        <i class="el-icon-s-grid"></i>
        <span slot="title">攻击矩阵</span>
      </el-menu-item>
      <el-menu-item index="/rules/index">
        <i class="el-icon-coordinate"></i>
        <span slot="title">规则库</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>

//从上一级传参is_collapse，is_collapse在layout的app-index.vue中定义
export default {
  props: ['is_collapse'],
  methods: {
    changeMenu() {
      //此处$emit指向上一级layout的app-index.vue中定义额度changeMenu函数，将is_collapse响应式变量置反
      this.$emit('changeMenu');
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu {
  border-right: 0;
  z-index: 999;
  .is-active {
    background: #5D90F7 !important;
    color: #fff !important;
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>