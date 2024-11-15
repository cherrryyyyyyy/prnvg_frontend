<template>
    <div>
        <div class="header1">
            <el-button type="text" @click="Goback" class="detailed">
                <h3>
                    ← 返回
                </h3>
            </el-button>
            <h3>
                &nbsp;&nbsp;&nbsp;&nbsp;日志详情
            </h3>
        </div>
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
                    <span slot="label" class="fontClass">是否被标记为事件</span>
                    <div class="fontClass">
                        {{ log_data.is_escalated }}
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

            <!--编写loginfo内容展示-->
            <h3>
                日志告警信息：
            </h3>
            <div>
                <json-viewer :value="log_info" :expand-depth="5" copyable boxed sort class="w-100%"></json-viewer>
            </div>
        </div>
    </div>
</template>



<script>
import Pagination from '@/component/pagination/page-tabs.vue'
import JsonViewer from 'vue-json-viewer'
export default {
    components: {
        Pagination,
        JsonViewer
    },
    data() {
        return {
            log_data: this.$route.query.index,
            log_info: JSON.parse(this.$route.query.index.log_info)
        }
    },
    methods: {
        Goback() {
            this.$router.push('/alert/index')
        },
        
    },
    created() {
        console.log('111');
        console.log(this.log_data);
        //this.getthreadlog();
    }

};

</script>


<style>
.header1 {
    height: 55px;
    border-bottom: 2px solid black;
    display: flex;
    align-items: center;
    color: antiquewhite;
    background: #091527;

}

.wrapper1 {
    padding: 10px;

}


.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.customcard {
    background-color: aquamarine;
}
</style>