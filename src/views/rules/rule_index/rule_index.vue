<template>
    <div>
        <div class="header">
            <h3>
                规则（{{ total }}个）
            </h3>
        </div>

        <div class="wrapper">
            <el-container>
                <el-main>
                    <template>
                        <el-table stripe=true :data="rule_log1" height=590 border style="width: 100%">
                            <el-table-column prop="id" label="rule_id" width="150" align="center"
                                show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column prop="name" label="规则名称" width="600" align="center"
                                show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column prop="tactic_id" label="所属战术id" width="100" align="center"
                                show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column prop="severity" label="严重程度" width="100" align="center"
                                show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <!--使用template拿取整行的数据 scope.$index 当前行索引号， scope.row 当前行内容-->
                                <template slot-scope="scope">
                                    <!--编辑功能待实现-->
                                    <el-button type="primary" size="mini" icon="el-icon-edit"
                                        @click="CaseDetail(scope.$index, scope.row)">事件详情</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>

                </el-main>
            </el-container>
            <div class="pagination">
                <Pagination :total="total" @CurrentChange="CurrentChange"></Pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { getRules } from '@/axios/api'
import Pagination from '@/component/pagination/page-tabs.vue'
export default {
    components: {
        Pagination
    },
    data() {
        return {
            total: 0,
            rule_log: [],
            rule_log1: [],
            page: 1,
        }
    },
    methods: {
        async get_rules(){
            let res = await getRules();
            this.rule_log = res;
            this.total = this.rule_log.length;
            this.logshow(1);
        },
        logshow(ppage) {
            //this.threatdata1 = [];
            this.rule_log1 = this.rule_log.slice((ppage - 1) * 10, ppage * 10);
            console.log(this.rule_log1);
        },
        RuleDetail(index,row){
            this.showdetail(row);
        },
        showdetail(val){
            this.$router.push(
                {
                    path: '/rule/ruledetail',
                    query: { index: val }
                })
        }
    },
    created() {
        this.get_case();
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
</style>