<template>
    <div>
        <div class="header1">
            <h3>
                <el-button type="text" @click="Goback" class="detailed">
                    <h3>
                        ← 返回
                    </h3>
                </el-button>
                {{this.$route.query.index}}技术详情
            </h3>
        </div>

        <div class="wrapper1">
            <el-descriptions column=2 border>
                <el-descriptions-item>
                    <span slot="label" class="fontClass">名称</span>
                    <div class="fontClass">
                        {{ this.Data.created }}
                    </div>
                </el-descriptions-item>
                <el-descriptions-item>
                    <span slot="label" class="fontClass">ID</span>
                    <div class="fontClass">
                        12341241234
                    </div>
                </el-descriptions-item>

            </el-descriptions>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    methods: {
        Goback() {
            this.$router.push('/matrix/index')
        },
        detail_init() {
            axios.get('http://' + location.host + '/technique/' + this.key + '.json').then((res) => {
                console.log(res.data.objects[0], 'res');
                if (res.status == 200) {
                    // data = res.data.data.userList;
                    this.Data = res.data.objects[0];
                } else {
                    alert('数据获取失败');
                }
            });
        }
    },
    data() {
        return {
            key: 0,
            Data: {},
        }
    },
    created() {
        this.key = this.$route.query.index;
        console.log(this.key);
        this.detail_init();
    }
}
</script>

<style lang="less" scoped>
.header {
    height: 55px;
    border-bottom: 2px solid black;
    display: flex;
    align-items: center;
    color: antiquewhite;
    background: #091527;

}

.wrapper {
    padding: 10px;
}

.fontClass {
    font-size: 20px;
    font-family: Microsoft Yahei;
}
</style>