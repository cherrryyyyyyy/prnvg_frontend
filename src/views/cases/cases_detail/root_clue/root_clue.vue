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
                            日志id：{{ log_data.log_id }}
                        </h3>
                    </div>
                </el-col>
            </el-row>
            <el-descriptions column=2 border>
                <el-descriptions-item>
                    <span slot="label" class="fontClass">日志源</span>
                    <div class="fontClass">
                        {{ log_data.host }}
                    </div>
                </el-descriptions-item>
                <el-descriptions-item>
                    <span slot="label" class="fontClass">ID</span>
                    <div class="fontClass">
                        {{ log_data.log_id }}
                    </div>
                </el-descriptions-item>

                <el-descriptions-item>
                    <span slot="label" class="fontClass">规则名称</span>
                    <div class="fontClass">
                        {{ log_data.rule_name }}
                    </div>
                </el-descriptions-item>

                <el-descriptions-item>
                    <span slot="label" class="fontClass">规则id</span>
                    <div class="fontClass">
                        {{ log_data.rule_id }}
                    </div>
                </el-descriptions-item>

                <el-descriptions-item>
                    <span slot="label" class="fontClass">所属战术id</span>
                    <div class="fontClass">
                        {{ log_data.tactic_id }}
                    </div>
                </el-descriptions-item>

                <el-descriptions-item>
                    <span slot="label" class="fontClass">所属技术id</span>
                    <div class="fontClass">
                        {{ log_data.technique_id }}
                    </div>
                </el-descriptions-item>

                <el-descriptions-item>
                    <span slot="label" class="fontClass">严重程度</span>
                    <div class="fontClass">
                        {{ log_data.severity }}
                    </div>
                </el-descriptions-item>

                <el-descriptions-item>
                    <span slot="label" class="fontClass">时间戳</span>
                    <div class="fontClass">
                        {{ log_data.timestamp }}
                    </div>
                </el-descriptions-item>
            </el-descriptions>
            <h3>
                日志告警信息：
            </h3>
            <div>
                <json-viewer :value="log_info" :expand-depth="5" copyable boxed sort class="w-100%"></json-viewer>
            </div>
            <!--漏洞风险分布图表-->
        </div>
    </div>
</template>

<script>
//import Pagination from '@/component/pagination/page-tabs.vue'
import { getLogs } from '@/axios/api'
import JsonViewer from 'vue-json-viewer'
export default {
    components: {
        JsonViewer
    },
    data() {
        return {
            caseData: this.caseData,
            log_data: {},
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
        async getRootCase(){
            let res = await getLogs();
            for(let re of res){
                if(re.log_id == this.caseData.log_id){
                    this.log_data = re;
                    break;
                }
            }
            this.log_info = JSON.parse(this.log_data.log_info);
        }
        
    },
    created() {
        console.log('chuang!!', this.caseData);
        console.log('log all')
        this.getRootCase();
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