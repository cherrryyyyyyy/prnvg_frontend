<template>
    <div>
        <div class="header1">
            <h3 color="white">
                仪表盘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-dropdown trigger="click" :hide-on-click="true">
                    <span class="el-dropdown-link" style="color: antiquewhite;">
                        选择源<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown" class="lang-select-dropdown">
                        <el-dropdown-item
                        v-for="host in this.hosts"
                        :key="host.value"
                        @click.native="refresh(host.value)">
                            {{ host.value }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </h3>
        </div>
        <div class="wrapper1">
            <el-row>
                <el-col :span="24">
                    <div class="grid-content">
                        <h1>
                            主机：{{ this.host }}
                        </h1>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <h1>
                            基本信息
                        </h1>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <div>
                        <div class="echart" id="mychart" :style="myChartStyle"></div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div>
                        <div class="echart" id="mychartlogs" :style="myChartStyle"></div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div>
                        <div class="echart" id="mycharttimeline" :style="myChartStyle"></div>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <h1>
                            主机告警桑基图
                        </h1>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content">
                        <div>
                            <div class="echart" id="sankey" :style="myChartStyle1"></div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>



<script>
import * as echarts from "echarts";
import { getLogs } from '@/axios/api'

export default {
    data() {
        return {
            myChartStyle: { float: "left", width: "70%", height: "250px" }, //图表样式
            threatlogs: [],
            myChartStyle1: { float: "left", width: "100%", height: "400px" }, //图表样式
            tactics: [],
            host: '',
            hosts: [],
            
        }
    },
    methods: {
        initEchartsbar() {
            let tactics = new Set();
            for (let items of this.threatlogs) {
                tactics.add(items.tactic_id);
            }
            let datas = [];
            let cont = 0;
            let tacticss = Array.from(tactics)
            this.tactics = tacticss;
            for (let tactic of tacticss) {
                datas[cont] = 0;
                for (let data of this.threatlogs) {
                    if (data.tactic_id == tactic && data.host == this.hosts[0].value) {
                        datas[cont]++;
                    }
                }
                cont++;
            }
            //console.log(datas);
            const option1 = {
                title: {
                    text: "行为统计",
                    x: "center",
                    textStyle: {
                        fontSize: 20, // 默认值：18
                        fontStyle: "italic", // normal:正常风格（默认值）,italic:倾斜体
                        fontWeight: "bold", // normal:正常粗细（默认值）,bold/bolder:粗体,lighter:正常粗细
                    },
                },
                xAxis: {
                    name: '技术',
                    data: tacticss
                },
                yAxis: { name: '告警个数', },
                series: [
                    {
                        type: 'bar',
                        data: datas,
                        label: {
                            // 柱状图上方文本标签，默认展示数值信息
                            show: true,
                            position: "top"
                        },
                        barWidth: "30%", // 每个柱条的宽度就是类目宽度的 20%
                    }
                ]
            };
            this.myChartbar = echarts.init(document.getElementById("mychart"));
            this.myChartbar.setOption(option1);
            window.addEventListener("resize", () => {
                this.myChartbar.resize();
            });
        },
        initEchartslogs() {
            const option2 = {
                title: {
                    text: "日志统计",
                    x: "center",
                    textStyle: {
                        fontSize: 20, // 默认值：18
                        fontStyle: "italic", // normal:正常风格（默认值）,italic:倾斜体
                        fontWeight: "bold", // normal:正常粗细（默认值）,bold/bolder:粗体,lighter:正常粗细
                    },
                },
                xAxis: {
                    name: '类型',
                    data: ['1', '2', '3']
                },
                yAxis: { name: '日志个数', },
                series: [
                    {
                        type: 'bar',
                        data: [1, 3, 4],
                        label: {
                            // 柱状图上方文本标签，默认展示数值信息
                            show: true,
                            position: "top"
                        },
                        barWidth: "30%", // 每个柱条的宽度就是类目宽度的 20%
                    }
                ]
            };
            this.myChartlog = echarts.init(document.getElementById("mychartlogs"));
            this.myChartlog.setOption(option2);
            window.addEventListener("resize", () => {
                this.myChartlog.resize();
            });
        },
        initEchartstimeline() {
            const option3 = {
                title: {
                    text: "时间线统计",
                    x: "center",
                    textStyle: {
                        fontSize: 20, // 默认值：18
                        fontStyle: "italic", // normal:正常风格（默认值）,italic:倾斜体
                        fontWeight: "bold", // normal:正常粗细（默认值）,bold/bolder:粗体,lighter:正常粗细
                    },
                },
                xAxis: {
                    name: '时间线',
                    type: 'category',
                    data: ['1', '2', '3']
                },
                yAxis: {
                    type: 'value',
                    name: '告警个数'
                },
                series: [
                    {
                        type: 'line',
                        data: [1, 3, 4],
                        label: {
                            // 柱状图上方文本标签，默认展示数值信息
                            show: true,
                            position: "top"
                        },
                        barWidth: "30%", // 每个柱条的宽度就是类目宽度的 20%
                    }
                ]
            };
            this.myCharttimeline = echarts.init(document.getElementById("mycharttimeline"));
            this.myCharttimeline.setOption(option3);
            window.addEventListener("resize", () => {
                this.myCharttimeline.resize();
            });
        },
        initSankey() {
            let allData = [];
            for (let tactic of this.tactics) {
                let text = {
                    name: '',
                    value: 0,
                    depth: 1,
                    itemStyle: { color: '' },
                };
                text.name = tactic;
                text.value = 0;
                text.itemStyle.color = this.getRandomColor();
                console.log(text);
                allData.push(text);

            }
            let op = 0;
            for (let items of this.threatlogs) {
                for (let data of allData) {
                    if (items.tactic_id == data.name && items.host == this.hosts[0].value) {
                        data.value += 1;
                        op += 1;
                    }
                }
            }
            console.log(allData);
            let text = {
                name: this.hosts[0].value,
                value: op,
                depth: 0,
                itemStyle: { color: "#7BA2DF" }
            };
            allData.push(text);
            // 测试数据1
            /*
            let allData = [
                { name: "本科生", value: 430, itemStyle: { color: "#7BA2DF" }, depth: 0 },
                { name: "预防医学", value: 60, itemStyle: { color: '#5FD981' }, depth: 1 },
                { name: "2022级", typeArr: [{ typeName: "本科", value: 50 }, { typeName: "硕士研究生", value: 30 }], itemStyle: { color: "#f8b551" }, depth: 2 },
                { name: "2021级", typeArr: [{ typeName: "硕士研究生", value: 50 }], itemStyle: { color: "#7ecef4" }, depth: 2 },
                { name: "2023级", typeArr: [{ typeName: "博士研究生", value: 50 }], itemStyle: { color: "#7ecef4" }, depth: 2 },
            ]*/
            let allGuideData = [];
            for (let data of allData) {
                let text = {
                    source: this.hosts[0].value,
                    target: '',
                    value: 0,
                };
                if (data.depth == 1) {
                    text.target = data.name;
                    text.value = data.value;
                    allGuideData.push(text);
                }

            }
            console.log(allGuideData);
            // 测试数据2，连线
            /*
            let allGuideData = [
                // L1→L3	 4509
                { source: "本科生", target: "预防医学", value: 800 },
                // L2→L3	 12196
                { source: "硕士研究生", target: "预防医学", value: 200 },
                // L1→L2→L3	 2404
                { source: "综合楼", target: "2022级", value: 200 },
                { source: "综合楼", target: "2023级", value: 200 },
                { source: "博士研究生", target: "2022级", value: 300 },
                { source: "预防医学", target: "2021级", value: 400 },
                { source: "预防医学", target: "2023级", value: 100 },
            ]*/
            const option4 = {
                tooltip: {
                    trigger: "item",
                    triggerOn: "mousemove",
                    rich: {
                        "a": {
                            "fontSize": 14,
                            "fontWeight": 500,
                            'color': '#fff',
                            padding: [0, 0, 5, 0],
                        }
                    },
                    // 鼠标滑上去的展示信息
                    formatter: function (params) {
                        if (params.data.source) {
                            return `${params.data.source}-${params.data.target}：${params.data.value}`;
                        } else {
                            return `${params.name}：${params.value}`;
                        }
                    }
                },
                series: {
                    type: "sankey",
                    layout: "none",
                    top: "1%",
                    bottom: "1%",
                    left: "0",
                    right: "16.5%",
                    draggable: false,
                    focusNodeAdjacency: 'allEdges', // 鼠标划上时高亮的节点和连线，allEdges表示鼠标划到节点上点亮节点上的连线及连线对应的节点
                    lineStyle: {
                        opacity: 0.3,
                        color: "gradient",
                        curveness: 0.7,
                    },
                    label: {
                        color: "#000",
                        fontSize: 15,
                        formatter: function (params) {
                            // 一级 硕士研究生 博士研究生
                            if (params.data.depth === 0 && params.data.name === '本科生') return "{a|" + params.data.name + "\n}" + "{b|" + params.data.value + "}";
                            if (params.data.depth === 0 && params.data.name === '硕士研究生') return "{a2|" + params.data.name + "\n}" + "{b2|" + params.data.value + "}";
                            if (params.data.depth === 0 && params.data.name === '博士研究生') return "{a3|" + params.data.name + "\n}" + "{b3|" + params.data.value + "}";
                            // 二级
                            if (params.data.depth === 1) return "{c|" + params.data.name + "}" + "{d|" + params.data.value + "}";
                            // 三级
                            if (params.data.depth === 2) {
                                let str = ''
                                params.data.typeArr.forEach(item => {
                                    // str += "{e|" + params.data.name + "/"+ item.typeName +"\n}"+"{f|" + item.value+ "\n}"
                                    str += "{m|" + params.data.name + "/" + item.typeName + "}" + "{n|" + item.value + "\n}"
                                })
                                return str;
                            }

                        },
                        rich: {
                            "a": {
                                "fontSize": 14,
                                "fontWeight": 500,
                                'color': '#7BA2DF',
                                padding: [0, 0, 5, 0],
                            },
                            "b": {
                                "fontSize": 24,
                                "fontWeight": 600,
                                'color': '#7BA2DF',
                                padding: [0, 0, 0, 0],
                            },
                            "a2": {
                                "fontSize": 14,
                                "fontWeight": 500,
                                'color': '#BA86ED',
                                padding: [0, 0, 5, 0],
                            },
                            "b2": {
                                "fontSize": 24,
                                "fontWeight": 600,
                                'color': '#BA86ED',
                                padding: [0, 0, 0, 0],
                            },
                            "a3": {
                                "fontSize": 14,
                                "fontWeight": 500,
                                'color': '#59DEC6',
                                padding: [0, 0, 5, 0],
                            },
                            "b3": {
                                "fontSize": 24,
                                "fontWeight": 600,
                                'color': '#59DEC6',
                                padding: [0, 0, 0, 0],
                            },
                            "c": {
                                "fontSize": 16,
                                "color": "#332D2D",
                                "lineHeight": 20,
                            },
                            "d": {
                                "fontSize": 16,
                                "fontWeight": 600,
                                "lineHeight": 20,
                                "color": "#332D2D ",
                                padding: [0, 0, 0, 2],
                            },
                            "e": {
                                "fontSize": 14,
                                "fontWeight": 500,
                                'color': '#332D2D',
                                padding: [0, 0, 5, 0],
                            },
                            "f": {
                                "fontSize": 16,
                                "fontWeight": 600,
                                'color': '#332D2D',
                                padding: [0, 0, 20, 0],
                            },
                            "m": {
                                "fontSize": 14,
                                "fontWeight": 500,
                                'color': '#332D2D',
                                padding: [0, 0, 0, 0],
                            },
                            "n": {
                                "fontSize": 16,
                                "fontWeight": 600,
                                'color': '#332D2D',
                                padding: [0, 0, 0, 10],
                            },
                        },
                    },
                    // nodeWidth:100,
                    nodeGap: 20, // 每一组之间的距离
                    layoutIterations: 0,// 自动优化列表，尽量减少线的交叉，为0就是按照数据排列
                    emphasis: {
                        focus: "adjacency",
                    },
                    data: allData,
                    links: allGuideData,
                },
            };
            this.myChartsankey = echarts.init(document.getElementById("sankey"));
            this.myChartsankey.setOption(option4);
            window.addEventListener("resize", () => {
                this.myChartsankey.resize();
            });
        },
        async GetThreatLogs() {
            let res = await getLogs();
            this.threatlogs = res;
            //console.log(this.threatlogs);
            this.gethosts();
            this.initEchartsbar();
            this.initEchartslogs();
            this.initEchartstimeline();
            this.initSankey();
            
        },
        refresh(host){
            console.log(host);
            this.host = host;
            let datas = [];
            let cont = 0;
            for (let tactic of this.tactics) {
                datas[cont] = 0;
                for (let data of this.threatlogs) {
                    if (data.tactic_id == tactic && data.host == host) {
                        datas[cont]++;
                    }
                }
                cont++;
            }
            let allData = [];
            for (let tactic of this.tactics) {
                let text = {
                    name: '',
                    value: 0,
                    depth: 1,
                    itemStyle: { color: '' },
                };
                text.name = tactic;
                text.value = 0;
                text.itemStyle.color = this.getRandomColor();
                console.log(text);
                allData.push(text);

            }
            let op = 0;
            for (let items of this.threatlogs) {
                for (let data of allData) {
                    if (items.tactic_id == data.name && items.host == host) {
                        data.value += 1;
                        op += 1;
                    }
                }
            }
            console.log(allData);
            let text = {
                name: host,
                value: op,
                depth: 0,
                itemStyle: { color: "#7BA2DF" }
            };
            allData.push(text);
            let allGuideData = [];
            for (let data of allData) {
                let text = {
                    source: host,
                    target: '',
                    value: 0,
                };
                if (data.depth == 1) {
                    text.target = data.name;
                    text.value = data.value;
                    allGuideData.push(text);
                }

            }
            console.log(allGuideData);
            const option1 = {
                title: {
                    text: "行为统计",
                    x: "center",
                    textStyle: {
                        fontSize: 20, // 默认值：18
                        fontStyle: "italic", // normal:正常风格（默认值）,italic:倾斜体
                        fontWeight: "bold", // normal:正常粗细（默认值）,bold/bolder:粗体,lighter:正常粗细
                    },
                },
                xAxis: {
                    name: '技术',
                    data: this.tactics
                },
                yAxis: { name: '告警个数', },
                series: [
                    {
                        type: 'bar',
                        data: datas,
                        label: {
                            // 柱状图上方文本标签，默认展示数值信息
                            show: true,
                            position: "top"
                        },
                        barWidth: "30%", // 每个柱条的宽度就是类目宽度的 20%
                    }
                ]
            };
            const option4 = {
                tooltip: {
                    trigger: "item",
                    triggerOn: "mousemove",
                    rich: {
                        "a": {
                            "fontSize": 14,
                            "fontWeight": 500,
                            'color': '#fff',
                            padding: [0, 0, 5, 0],
                        }
                    },
                    // 鼠标滑上去的展示信息
                    formatter: function (params) {
                        if (params.data.source) {
                            return `${params.data.source}-${params.data.target}：${params.data.value}`;
                        } else {
                            return `${params.name}：${params.value}`;
                        }
                    }
                },
                series: {
                    type: "sankey",
                    layout: "none",
                    top: "1%",
                    bottom: "1%",
                    left: "0",
                    right: "16.5%",
                    draggable: false,
                    focusNodeAdjacency: 'allEdges', // 鼠标划上时高亮的节点和连线，allEdges表示鼠标划到节点上点亮节点上的连线及连线对应的节点
                    lineStyle: {
                        opacity: 0.3,
                        color: "gradient",
                        curveness: 0.7,
                    },
                    label: {
                        color: "#000",
                        fontSize: 15,
                        formatter: function (params) {
                            // 一级 硕士研究生 博士研究生
                            if (params.data.depth === 0 && params.data.name === '本科生') return "{a|" + params.data.name + "\n}" + "{b|" + params.data.value + "}";
                            if (params.data.depth === 0 && params.data.name === '硕士研究生') return "{a2|" + params.data.name + "\n}" + "{b2|" + params.data.value + "}";
                            if (params.data.depth === 0 && params.data.name === '博士研究生') return "{a3|" + params.data.name + "\n}" + "{b3|" + params.data.value + "}";
                            // 二级
                            if (params.data.depth === 1) return "{c|" + params.data.name + "}" + "{d|" + params.data.value + "}";
                            // 三级
                            if (params.data.depth === 2) {
                                let str = ''
                                params.data.typeArr.forEach(item => {
                                    // str += "{e|" + params.data.name + "/"+ item.typeName +"\n}"+"{f|" + item.value+ "\n}"
                                    str += "{m|" + params.data.name + "/" + item.typeName + "}" + "{n|" + item.value + "\n}"
                                })
                                return str;
                            }

                        },
                        rich: {
                            "a": {
                                "fontSize": 14,
                                "fontWeight": 500,
                                'color': '#7BA2DF',
                                padding: [0, 0, 5, 0],
                            },
                            "b": {
                                "fontSize": 24,
                                "fontWeight": 600,
                                'color': '#7BA2DF',
                                padding: [0, 0, 0, 0],
                            },
                            "a2": {
                                "fontSize": 14,
                                "fontWeight": 500,
                                'color': '#BA86ED',
                                padding: [0, 0, 5, 0],
                            },
                            "b2": {
                                "fontSize": 24,
                                "fontWeight": 600,
                                'color': '#BA86ED',
                                padding: [0, 0, 0, 0],
                            },
                            "a3": {
                                "fontSize": 14,
                                "fontWeight": 500,
                                'color': '#59DEC6',
                                padding: [0, 0, 5, 0],
                            },
                            "b3": {
                                "fontSize": 24,
                                "fontWeight": 600,
                                'color': '#59DEC6',
                                padding: [0, 0, 0, 0],
                            },
                            "c": {
                                "fontSize": 16,
                                "color": "#332D2D",
                                "lineHeight": 20,
                            },
                            "d": {
                                "fontSize": 16,
                                "fontWeight": 600,
                                "lineHeight": 20,
                                "color": "#332D2D ",
                                padding: [0, 0, 0, 2],
                            },
                            "e": {
                                "fontSize": 14,
                                "fontWeight": 500,
                                'color': '#332D2D',
                                padding: [0, 0, 5, 0],
                            },
                            "f": {
                                "fontSize": 16,
                                "fontWeight": 600,
                                'color': '#332D2D',
                                padding: [0, 0, 20, 0],
                            },
                            "m": {
                                "fontSize": 14,
                                "fontWeight": 500,
                                'color': '#332D2D',
                                padding: [0, 0, 0, 0],
                            },
                            "n": {
                                "fontSize": 16,
                                "fontWeight": 600,
                                'color': '#332D2D',
                                padding: [0, 0, 0, 10],
                            },
                        },
                    },
                    // nodeWidth:100,
                    nodeGap: 20, // 每一组之间的距离
                    layoutIterations: 0,// 自动优化列表，尽量减少线的交叉，为0就是按照数据排列
                    emphasis: {
                        focus: "adjacency",
                    },
                    data: allData,
                    links: allGuideData,
                },
            };
            this.myChartbar.setOption(option1);
            this.myChartsankey.setOption(option4);
        },
        gethosts(){
            let hosts = new Set()
            for(let log of this.threatlogs){
                hosts.add(log.host);
            }
            let hostss = Array.from(hosts);
            for(let item of hostss){
                let host = {
                    value: item,
                    label: item
                }
                this.hosts.push(host);
            }
            this.host = this.hosts[0].value;
            console.log(this.hosts)
        },
        getRandomColor() {
            // 生成随机的 R、G、B 分量
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);

            // 将 RGB 转换为十六进制表示
            var color = "#" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');

            return color;
        }
    },
    mounted() {
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

.bg-purple-dark {
    background: #c6ced8;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.lang-select-dropdown {
    position: absolute !important;
    left: 250px !important;
  }
</style>