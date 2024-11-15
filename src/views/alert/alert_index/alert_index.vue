<template>
    <div>
        <div class="header1">
            <h3>
                告警详情
            </h3>
        </div>
        <div class="wrapper1">
            <el-row>
                <el-col :span="24">
                    <div class="grid-content"></div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <h3>
                            选择刷新间隔
                        </h3>
                        <el-select v-model="value[1]" placeholder="刷新间隔" style="width: 100%;">
                            <template slot="prefix">
                                <span style="padding: 5px;line-height: 33px;font-size: 18px; color: #409eff;">
                                    <i class="el-icon-refresh"></i>
                                </span>
                            </template>
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value">

                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <h3>
                            选择时间范围
                        </h3>
                        <div class="block">
                            <el-date-picker v-model="value2" type="datetimerange" :picker-options="pickerOptions"
                                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"
                                style="width: 100%;">
                            </el-date-picker>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <h3>
                            输入抓取条目数
                        </h3>
                        <el-select v-model="input" placeholder="条目数" style="width: 100%;">
                            <template slot="prefix">
                                <span style="padding: 5px;line-height: 33px;font-size: 18px; color: #409eff;">
                                    <i class="el-icon-edit"></i>
                                </span>
                            </template>
                            <el-option v-for="item in numss" :key="item.value" :label="item.label" :value="item.value">

                            </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>
            
            <template>
                <el-table :data="threatdata1" stripe style="width: 100%">
                    <el-table-column prop="severity" width="80">
                        <template slot-scope="scope">
                            <i class="el-icon-message-solid"
                                :style="scope.row.severity == 'informational' ? styleinfo : scope.row.severity == 'low' ? stylelow : scope.row.severity == 'medium' ? stylemedium : stylehigh"></i>
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="count" label="总数" width="100">
                    </el-table-column>
                    <el-table-column prop="rule_name" label="规则名称" width="400">
                    </el-table-column>
                    <el-table-column prop="severity" label="事件威胁程度" width="150">
                    </el-table-column>
                    <el-table-column prop="rule_id" label="规则id" width="600">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <!--使用template拿取整行的数据 scope.$index 当前行索引号， scope.row 当前行内容-->
                        <template slot-scope="scope">
                            <!--编辑功能待实现-->
                            <el-button type="primary" size="mini" icon="el-icon-edit"
                                @click="AlertDetail(scope.$index, scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="pagination">
                <Pagination :total="total" @CurrentChange="CurrentChange"></Pagination>
            </div>
        </div>
    </div>
</template>



<script>
import Pagination from '@/component/pagination/page-tabs.vue'
import { getLogs } from '@/axios/api'
import { Update_Escalated_Log } from '@/axios/api';

export default {
    components: {
        Pagination
    },
    data() {
        return {
            options: [
                {
                    label: '从不',
                    value: 0
                },
                {
                    label: '30秒',
                    value: 0.5
                },
                {
                    label: '1分钟',
                    value: 1
                },
                {
                    label: '2分钟',
                    value: 2
                }
            ],
            numss: [{
                label: '300条',
                value: 300,
            }, {
                label: '500条',
                value: 500,
            }, {
                label: '1000条',
                value: 1000
            }],
            value: [],
            value2: true,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
            value2: '',
            input: '',
            threatlogs: [],
            threatdata: [],
            threatdataes: [],
            threatdata1: [],
            styleinfo: "color: aqua;",
            stylelow: "color: yellow;",
            stylemedium: "color: orange",
            stylehigh: "color: red",
            
            total: 0,


        }
    },
    methods: {
        async GetThreatLogs() {
            let res = await getLogs();
            this.threatlogs = res;
            console.log(this.threatlogs);
            let rules = new Set();
            let log_ids = [];
            for (let items of this.threatlogs) {
                rules.add(items.rule_name);
                log_ids.push(items.log_id);
            }
            console.log(log_ids);
            let ruless = Array.from(rules);
            console.log(ruless);
            for (let rule of ruless) {
                let text = {
                    'count': 0,
                    'severity': '',
                    'rule_name': '',
                    'rule_id': '',
                    'is_escalated': false
                }
                text.rule_name = rule;
                for (let item of this.threatlogs) {
                    if (item.rule_name == rule) {
                        text.rule_id = item.rule_id;
                        text.severity = item.severity;
                        break;
                    }
                }
                this.threatdata.push(text);
            }
            for (let items of this.threatlogs) {
                for (let data of this.threatdata) {
                    if (items.rule_name == data.rule_name) {
                        data.count++;
                        break;
                    }
                }
            }
            for (let param of this.threatlogs) {
                let res = await Update_Escalated_Log({param});
            }
            
            this.total = this.threatdata.length;
            this.logshow(1);
            //console.log(this.threatdata);
        },
        AlertDetail(index, row) {
            console.log(index, row);
            this.showdetail(row)
        },
        showdetail(val) {
            this.$router.push(
                {
                    path: '/alert/alertdetail',
                    query: { index: val }
                })
        },
        logshow(ppage) {
            //this.threatdata1 = [];
            this.threatdata1 = this.threatdata.slice((ppage - 1) * 10, ppage * 10);
            console.log(this.threatdata1);
        },
        CurrentChange(val) {
            console.log('頁嗎', val);
            this.logshow(val);
            this.page = val;
        },
        async changeStatus(){
            console.log(this.value2);
            let threat = this.threatdata;
            console.log(threat);
            if(value2 == false){
                for(let item of threat){
                    if(item.is_escalated == true){
                        
                    }
                }
            }
        }

    },
    created() {
        this.GetThreatLogs();
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