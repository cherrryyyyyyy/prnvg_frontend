<template>
    <div>
        <div class="header1">
            <h3>
                <el-button type="text" @click="Goback" class="detailed">
                    <h3>
                        ← 返回
                    </h3>
                </el-button>
                事件详情:{{ this.caseData.case_name }}
            </h3>
        </div>
        <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" router background-color="#409eff"
            text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="/case/casedetail/root_clue">根线索</el-menu-item>
            <el-menu-item index="/case/casedetail/traceability_diagram">溯源图</el-menu-item>
            <el-menu-item index="/case/casedetail/disposal_record">处置记录</el-menu-item>
        </el-menu>

        <div class="wrapper1">
            <el-row>
                <el-col :span="24">
                    <div class="grid-content">
                        <h3>
                            处置记录
                        </h3>
                    </div>
                </el-col>
            </el-row>
            <el-input type="textarea" :autosize="{ minRows: 20, maxRows: 20 }" placeholder="处置记录输入" v-model="textarea2">
            </el-input>
            <el-row>
                
            </el-row>
            <el-button 
            type="primary" 
            @click="onSubmit"
            :disabled="this.caseData.is_open == '1'  ?  false : true">提交处置结果并关闭事件</el-button>
            <!--漏洞风险分布图表-->
        </div>
    </div>
</template>

<script>
//import Pagination from '@/component/pagination/page-tabs.vue'
import { getLogs } from '@/axios/api'
import JsonViewer from 'vue-json-viewer'
import {update_case_log} from '@/axios/api'
export default {
    components: {
        JsonViewer
    },
    data() {
        return {
            caseData: this.caseData,
            log_data: {},
            textarea2: ''
        }
    },
    props: {
        caseData: {
            type: Array,
            default: () => [],
        }
    },
    methods: {
        Goback() {
            this.$router.push('/case/index')
        },
        async getRootCase() {
            let res = await getLogs();
            for (let re of res) {
                if (re.log_id == this.caseData.log_id) {
                    this.log_data = re;
                    break;
                }
            }
            this.log_info = JSON.parse(this.log_data.log_info);
        },
        async onSubmit(){
            let param ={
                text : this.textarea2,
                case_id : this.caseData.case_id
            }
            let res = await update_case_log({ param });
            this.Goback();
        }

    },
    created() {
        console.log('chuang!!', this.caseData);
        console.log('log all')
        this.getRootCase();
        this.textarea2 = this.caseData.disposal_record;
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