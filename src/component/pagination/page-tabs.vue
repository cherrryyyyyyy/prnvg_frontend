<!--
  分页组件，可以在多个页面重用，只需要导入组件 保证变量独立
-->
<template>
    <div>
        <!--
          el-pagination 分页组件
            small	是否使用小型分页样式
            background	是否为分页按钮添加背景色	
            page-size	每页显示条目个数，支持 .sync 修饰符
            total	总条目数
            current-page	当前页数，支持 .sync 修饰符	
            layout	组件布局，子组件名用逗号分隔
            page-sizes	每页显示个数选择器的选项设置
          event:
            size-change	pageSize 改变时会触发
            current-change	currentPage 改变时会触发 

        -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </div>
</template>

<script>
    export default {
      props:{
            total:{
              type:Number,
              default:100
            }
      },
        methods: {
          //目前没有用到，此为处理每页显示条目数的函数，目前固定每页条目数为8
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      //处理页面跳转函数
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.$emit('CurrentChange',val);
      }
    },
    data() {
      return {
        currentPage: 1
        //默认页码为1
      };
    }
    }
</script>

<style lang="scss" scoped>

</style>