<template>
    <div>
        <div class="header1">
            <h3>
                事件
            </h3>
        </div>
        <div class="wrapper1">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple-light">
                        <h3>
                            选择时间范围
                        </h3>
                        <div class="block">
                            <el-date-picker v-model="value2" type="datetimerange" :picker-options="pickerOptions"
                                range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="right"
                                style="width: 100%;">
                            </el-date-picker>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <h3>
                            选择事件筛选类型
                        </h3>
                        <el-select v-model="input" placeholder="事件类型" style="width: 100%;">
                            <template slot="prefix">
                                <span style="padding: 5px;line-height: 33px;font-size: 18px; color: #409eff;">
                                    <i class="el-icon-edit"></i>
                                </span>
                            </template>
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">

                            </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>
            <template>
                <el-table :data="case_log1" stripe style="width: 100%">    
                    <el-table-column prop="create_time" label="创建时间" width="300">
                    </el-table-column>           
                    <el-table-column prop="case_name" label="标题" width="100">
                    </el-table-column>
                    <el-table-column prop="rule_name" label="规则名称" width="400">
                    </el-table-column>
                    <el-table-column prop="severity" label="事件威胁程度" width="150">
                    </el-table-column>
                    <el-table-column prop="rule_id" label="规则id" width="400">
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
import { getAlert } from '@/axios/api';

export default {
    components: {
        Pagination
    },
    data() {
        return {
            options: [
                {
                    label: '开启',
                    value: 0
                },
                {
                    label: '关闭',
                    value: 1
                },
                {
                    label: '所有',
                    value: 2
                }
            ],
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
            input: 2,
            case_log:[],
            case_logg: [],
            case_log1: [],
            showlog: [],
            styleinfo: "color: aqua;",
            stylelow: "color: yellow;",
            stylemedium: "color: orange",
            stylehigh: "color: red",
            
            total: 0,


        }
    },
    methods: {
        async get_case(){
            let res = await getAlert();
            this.case_log = res;
            for(let log of this.case_log){
                if(log.is_escalated == 1){
                    this.case_logg.push(log);
                }
            }


            this.total = this.case_logg.length;
            this.logshow(1);
        },
        logshow(ppage) {
            //this.threatdata1 = [];
            this.case_log1 = this.case_logg.slice((ppage - 1) * 10, ppage * 10);
            console.log(this.case_log1);
        },
        CaseDetail(index,row){
            this.showdetail(row);
        },
        showdetail(val){
            this.$router.push(
                {
                    path: '/case/casedetail',
                    query: { index: val }
                })
        }

    },
    created() {
        this.get_case();
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