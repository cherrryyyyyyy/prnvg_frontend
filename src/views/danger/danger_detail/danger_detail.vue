<template>
    <div>
        <div class="header">
            <h3>
                <el-button type="text" @click="Goback" class="detailed">
                    <h3>
                        ← 返回
                    </h3>
                </el-button>
                    漏洞资源详情
            </h3>
        </div>

        <div class="wrapper">
            <el-descriptions column=1 border>
                <el-descriptions-item labelStyle="width: 125px">
                    <span slot="label" class="fontClass">名称</span>
                    <div class="fontClass">
                        {{ data.id }}
                    </div>
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data : [],
        }
    },
    methods: {
        Goback() {
            this.$router.push('/danger/index')
        },
        detail_init(){
            this.data = this.$route.query.index;
            console.log(this.data);
        }
    },
    created() {
        this.detail_init();
    }
};
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
