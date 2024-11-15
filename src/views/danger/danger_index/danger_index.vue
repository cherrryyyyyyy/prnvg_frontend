<template>
    <div>
        <div class="header1">
            <h3>
                攻击行为详情
            </h3>
        </div>
        <div class="wrapper1">
            <el-table stripe=true :data="ruleForm" height=590 border style="width: 100%">
                <el-table-column prop="id" label="攻击行为id" width="200" align="center" show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="tactic_name" label="攻击行为名称" width="300" align="center"
                    show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="technique_id" label="攻击技术id" width="200" align="center"></el-table-column>
                <el-table-column prop="technique_name" label="攻击技术名称" width="300" align="center"
                    show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <!--使用template拿取整行的数据 scope.$index 当前行索引号， scope.row 当前行内容-->
                    <template slot-scope="scope">
                        <!--编辑功能待实现-->
                        <el-button type="primary" size="mini" icon="el-icon-edit"
                            @click="StrategyDetail(scope.$index, scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>



<script>
export default {
    data() {
        return {
            ruleForm: [
                {
                    'id': 'TA0010',
                    'tactic_name': '窃取数据',
                    'technique_id': 'T1052',
                    'technique_name': '物理介质上的渗漏',
                },
                {
                    'id': 'TA0043',
                    'tactic_name': '侦察目标',
                    'technique_id': 'T1598',
                    'technique_name': '网络钓鱼获取信息',
                }
            ]
        }
    },
    methods: {
        StrategyDetail(index, row) {
            console.log(index, row);
            //index += (this.page - 1) * 10;
            console.log(row);
            this.showdetail(row);
        },
        showdetail(val) {
            this.$router.push(
                {
                    path: '/danger/detail',
                    query: { index: val }
                })
        }
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