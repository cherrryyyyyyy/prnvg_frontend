<template>    
    <div>
        <router-view :caseData="caseData"></router-view>
    </div>
</template>

<script> 
//import Pagination from '@/component/pagination/page-tabs.vue'
export default {
    data() {
        return {
            activeIndex: '1',
            Data: [],
            host: [],
            caseData: this.$route.query.index,
            total: 0,
            hostDD: [],
            task_time: 0,
            id: '',
            page: 1,
        }
    },
    methods: {
        Gonext(){
            this.$router.push('/case/casedetail/root_clue')
        }
    },
    created() {
        console.log('lllklkl',this.$route.query.index);
        this.Gonext();
    }
}
</script>

<style lang="less" scoped>
.header {
    height: 55px;
    background: #fff;
    border-bottom: 2px solid black;
    display: flex;
    align-items: center;
  
  }
.wrapper {
    padding: 10px;
}

.fontClass {
    font-size: 20px;
    font-family: Microsoft Yahei;
}
</style>