<template>
    <div>
        <div class="header1">
            <el-button type="text" @click="Goback" class="detailed">
                <h3>
                    ← 返回
                </h3>
            </el-button>
            <h3>
                &nbsp;&nbsp;&nbsp;&nbsp;告警详情
            </h3>
        </div>
        <div class="wrapper1">
            <el-row>
                <el-col :span="24">
                    <div class="grid-content"></div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content">
                        <el-switch style="display: block" v-model="value2" active-color="#13ce66"
                            inactive-color="#ff4949" active-text="未标记为事件的告警" inactive-text="已标记为事件的告警"
                            @change='changeStatus'>
                        </el-switch>
                    </div>
                </el-col>
            </el-row>
            <el-container>
                <template>
                    <el-table :data="threatdata1" stripe style="width: 100%">
                        <el-table-column prop="level" width="80">
                            <template slot-scope="scope">
                                <i class="el-icon-message-solid"
                                    :style="scope.row.severity == 'informational' ? styleinfo : scope.row.severity == 'low' ? stylelow : stylehigh"></i>
                            </template>
                        </el-table-column>
                        <el-table-column prop="severity" width="80">
                            <template slot-scope="scope">
                                <i :class="!scope.row.is_escalated ? icon_star_off : icon_star_on"></i>
                            </template>
                        </el-table-column>
                        <el-table-column prop="rule_name" label="规则名称" width="250">
                        </el-table-column>
                        <el-table-column prop="rule_id" label="规则id" width="500">
                        </el-table-column>
                        <el-table-column prop="tactic_id" label="规则战术" width="100">
                        </el-table-column>
                        <el-table-column prop="technique_id" label="规则技术" width="100">
                        </el-table-column>
                        <el-table-column prop="log_id" label="告警日志id" width="300">
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <!--使用template拿取整行的数据 scope.$index 当前行索引号， scope.row 当前行内容-->
                            <template slot-scope="scope">
                                <!--编辑功能待实现-->
                                <el-button type="primary" size="mini" icon="el-icon-edit"
                                    @click="AlertDetail(scope.$index, scope.row)">详情</el-button>
                                <el-button type="warning" size="mini" icon="el-icon-upload2"
                                    @click="CaseCreate(scope.$index, scope.row)">提升为事件</el-button>
                                <el-dialog title="添加事件" :visible.sync="dialogFormVisible">
                                    <el-form>
                                        <el-form-item label="事件名称" :label-width="formLabelWidth">
                                            <el-input v-model="case_name" autocomplete="off"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                                        <el-button type="primary" @click="Escalate_log()">确
                                            定</el-button>
                                    </div>
                                </el-dialog>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-container>
            <div class="pagination">
                <Pagination :total="total" @CurrentChange="CurrentChange"></Pagination>
            </div>
        </div>
    </div>
</template>



<script>
import Pagination from '@/component/pagination/page-tabs.vue'
import { getLogs } from '@/axios/api'
import { getAlert } from '@/axios/api';
import { Update_Escalated } from '@/axios/api';
export default {
    components: {
        Pagination
    },
    data() {
        return {
            rule_name: this.$route.query.index.rule_name,
            threatlogs: [],
            threatdata: [],
            styleinfo: "color: aqua;",
            stylelow: "color: yellow;",
            stylemedium: "color: orange",
            stylehigh: "color: red",
            total: 20,
            page: 1,
            threatdata1: [],
            value2: 0,
            log_is_escalated: [],
            icon_star_on: "el-icon-star-on",
            icon_star_off: "el-icon-star-off",
            dialogFormVisible: false,
            case_name: '',
            formLabelWidth: '120px',
            index : 0,
            row : {},
        }
    },
    methods: {
        Goback() {
            this.$router.push('/alert/index')
        },
        async getthreadlog() {
            this.threatlogs = [];
            this.threatdata = [];
            let res = await getLogs();
            this.threatlogs = res;
            //console.log(this.threatlogs)
            for (let item of this.threatlogs) {
                if (item.rule_name == this.rule_name) {
                    this.threatdata.push(item);
                }
            }
            this.total = this.threatdata.length;
            //console.log('threat_data:',this.threatdata);
            let res2 = await getAlert();
            this.log_is_escalated = res2;
            for (let data of this.threatdata) {
                for (let log of this.log_is_escalated) {
                    if (data.log_id == log.log_id) {
                        data['is_escalated'] = log.is_escalated;
                    }
                }
            }
            console.log('threat_data:', this.threatdata);
            this.logshow(this.page);
        },
        logshow(ppage) {
            //this.threatdata1 = [];
            this.threatdata1 = this.threatdata.slice((ppage - 1) * 10, ppage * 10);
            console.log('threatdata1:', this.threatdata1);
        },
        CurrentChange(val) {
            console.log('頁嗎', val);
            this.logshow(val);
            this.page = val;
        },
        async Escalate_log() {
            /*
            let param = row.log_id;
            console.log(param);
            let res = await Update_Escalated({ param });
            this.getthreadlog();
            */

            console.log(this.case_name);
            let hash = this.hashString(this.case_name);
            let param = {
                case_name: this.case_name,
                log_id: this.row.log_id,
                case_id: hash
            }
            console.log(param);
            let res = await Update_Escalated({ param });
            this.getthreadlog();
            this.dialogFormVisible = false;
        },
        AlertDetail(index, row) {
            console.log(index, row);
            this.showdetail(row)
        },
        hashString(str) {
            let hash = 0;  // 初始化哈希值
            for (let char of str) {  // 迭代每个字符
                hash = (hash << 5) - hash + char.charCodeAt(0);  // 计算哈希值
            }
            str = hash.toString();
            return str;  // 返回最终的哈希值
        },
        CaseCreate(index,row){
            this.dialogFormVisible = true;
            this.index = index;
            this.row = row;
        },
        showdetail(val) {
            this.$router.push(
                {
                    path: '/alert/logdetail',
                    query: { index: val }
                })
        }
    },
    created() {
        console.log('111');
        this.getthreadlog();
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