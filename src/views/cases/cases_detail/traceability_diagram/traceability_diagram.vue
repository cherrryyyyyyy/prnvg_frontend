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
            <!--显示前向、中向图的选项-->
            <template>
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </template>
            <el-button type="primary" @click="onSubmit">创建图表</el-button>
            <div class="wrapper1" v-loading="this.knowlegGraphshow" style="border: 1px solid black;">
                <!--
                <el-row>
                    <el-col :span="20">
                        <div class="grid-content bg-purple">
                            <div id="network_id" ref="network_id" class="network" style="height: 700px;width: 1400px;">
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <el-descriptions :column="1" border style="height: 300px;width: 300px">
                                <template v-for="(item, index) in clientInfo.contactInfo">
                                    <el-descriptions-item label="联系人"
                                        :key="index">{{ item.contactPerson }}</el-descriptions-item>
                                    <el-descriptions-item label="联系电话"
                                        :key="index">{{ item.contactPhone }}</el-descriptions-item>
                                </template>
                            </el-descriptions>
                        </div>
                    </el-col>        
                </el-row>
                -->
            </div>
        </div>
    </div>
</template>

<script>
//import Pagination from '@/component/pagination/page-tabs.vue'
const Vis = require('vis-network/dist/vis-network.min');
require('vis-network/dist/dist/vis-network.min.css');
var neo4j = require("neo4j-driver");
import { getLogs } from '@/axios/api'
import { getNodeLog } from '@/axios/api'
import { GraphConstruct } from '@/axios/graph'
import { SubGraphConstruct } from '@/axios/graph'
export default {
    data() {
        return {
            caseData: this.caseData,
            echartsNode: [],
            nodesRelation: [],
            clearAll: false,
            nodesArray: [],
            echartsData: [],
            edgesArray: [],
            knowlegGraphshow: true,
            records: [],
            log_data: {},
            options: [{
                label: '显示全图',
                value: 'all'
            }, {
                label: '显示前向图',
                value: 'forward'
            }, {
                label: '显示后向图',
                value: 'back'
            }],
            value: 'all',
            node_color: {
                'file': 'blue',
                'threat': 'yellow',
                'process': 'purple',
                'fdpair': 'orange',
                'network_socket': 'grey',
                'directory': 'green',
                'named_pipe': 'red',
                'unknown': 'black',
                'unix_socket': 'brown'
            }
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
            console.log('4124124', this.log_data);
            this.Graph_construct();

            //this.log_info = JSON.parse(this.log_data.log_info);
        },
        executeCypher(query) {
            this.echartsNode = []  //节点数组
            this.nodesRelation = [] //关系线数组
            // 创建实例
            this.driver = neo4j.driver('bolt://10.114.23.20:7687', neo4j.auth.basic('neo4j', '12345678'));
            console.log("🚀 ~ file: AuthorArticleSearch.vue ~ line 46 ~ mounted ~  this.drive", this.driver)

            let me = this;
            me.records = [];
            this.clearAll = true;
            let session = this.driver.session();
            if (query == "") return;
            session.run(query, {}).then((result) => {
                me.clearAll = false;
                me.records = result.records;
                console.log("neo4j 查询结果", result.records);

                // 开始处理数据
                let nodes = new Set();
                for (let i = 0; i < me.records.length; i++) {
                    nodes.add(me.records[i]._fields[0].segments[0].relationship.startNodeElementId);
                    nodes.add(me.records[i]._fields[0].segments[0].relationship.endNodeElementId);
                    this.nodesRelation.push({
                        from: me.records[i]._fields[0].segments[0].relationship.startNodeElementId,
                        to: me.records[i]._fields[0].segments[0].relationship.endNodeElementId,
                        label: me.records[i]._fields[0].segments[0].relationship.type,
                        id: i,
                    });
                }
                //console.log(nodes);
                let nodename = [];
                for (let i = 0; i < me.records.length; i++) {
                    console.log('2');
                    nodename.push({
                        id: me.records[i]._fields[0].segments[0].relationship.startNodeElementId,
                        name: me.records[i]._fields[0].segments[0].start.properties.name,
                        inode: me.records[i]._fields[0].segments[0].start.properties.inode,
                        type: me.records[i]._fields[0].segments[0].start.labels[0],
                        fd1: me.records[i]._fields[0].segments[0].start.properties.fd1,
                        remote_host: me.records[i]._fields[0].segments[0].start.properties.remote_host
                    });
                    nodename.push({
                        id: me.records[i]._fields[0].segments[0].relationship.endNodeElementId,
                        name: me.records[i]._fields[0].segments[0].end.properties.name,
                        inode: me.records[i]._fields[0].segments[0].end.properties.inode,
                        type: me.records[i]._fields[0].segments[0].end.labels[0],
                        fd1: me.records[i]._fields[0].segments[0].end.properties.fd1,
                        remote_host: me.records[i]._fields[0].segments[0].end.properties.remote_host
                    });
                }
                console.log(nodename);
                nodes.forEach((e) => {
                    console.log('1');
                    for (let i = 0; i < nodename.length; i++) {
                        if (e == nodename[i].id) {
                            if (nodename[i].name != undefined) {
                                this.echartsData.push({
                                    label: nodename[i].name,
                                    id: e,
                                    color: this.node_color[nodename[i].type]
                                });
                                break;
                            }
                            if (nodename[i].inode != undefined) {
                                this.echartsData.push({
                                    label: nodename[i].inode,
                                    id: e,
                                    color: this.node_color[nodename[i].type]
                                });
                                break;
                            }
                            if (nodename[i].fd1 != undefined) {
                                this.echartsData.push({
                                    label: nodename[i].fd1,
                                    id: e,
                                    color: this.node_color[nodename[i].type]
                                });
                                break;
                            }
                            if (nodename[i].remote_host != undefined) {
                                this.echartsData.push({
                                    label: nodename[i].remote_host,
                                    id: e,
                                    color: this.node_color[nodename[i].type]
                                });
                                break;
                            }
                        }
                    }
                    /*
                     this.echartsData.push({
                         label: e,
                         id: e,
                     });
                     */
                })
                session.close();
                me.closeLoading(false);
                this.nodesArray = this.echartsData  //节点数组
                this.edgesArray = this.nodesRelation //关系线数组
                this.visDraw();
                console.log(this.nodesArray)
            }).catch(function (error) {
                console.log("Cypher 执行失败！", error);
                me.driver.close();
            });
            setTimeout(() => {
                this.knowlegGraphshow = false
            }, 4000);
        },
        closeLoading(status) {
            console.log('closeLoading', status);
            return;
        },
        visDraw() {
            let container = this.$refs.network_id;
            let data = { nodes: this.nodesArray, edges: this.edgesArray }
            console.log("🚀 ~ file: pageKnowlegGraph.vue ~ line 135 ~ visDraw ~ data", data)
            let options = {
                autoResize: true,
                // / 设置节点样式
                nodes: {
                    shape: "dot",
                    size: 20,
                    font: {
                        //字体配置
                        size: 20
                    },
                    color: {
                        // border: "#2B7CE9", //节点边框颜色
                        background: "#97C2FC", //节点背景颜色
                        highlight: {
                            //节点选中时状态颜色
                            border: "#2B7CE9",
                            background: "#D2E5FF"
                        },
                        hover: {
                            //节点鼠标滑过时状态颜色
                            border: "#2B7CE9",
                            background: "#D2E5FF"
                        }
                    },
                    borderWidth: 0, //节点边框宽度，单位为px
                    borderWidthSelected: 2 //节点被选中时边框的宽度，单位为px
                },
                // 边线配置
                edges: {
                    width: 1,
                    length: 260,
                    color: {
                        color: "#848484",
                        highlight: "#848484",
                        hover: "#848484",
                        inherit: "from",
                        opacity: 1.0
                    },
                    shadow: false,
                    smooth: {
                        //设置两个节点之前的连线的状态
                        enabled: true //默认是true，设置为false之后，两个节点之前的连线始终为直线，不会出现贝塞尔曲线
                    },
                    arrows: { to: true } //箭头指向to
                },
                //计算节点之前斥力，进行自动排列的属性
                physics: {
                    // enabled: true, //默认是true，设置为false后，节点将不会自动改变，拖动谁谁动。不影响其他的节点
                    barnesHut: {
                        gravitationalConstant: -4000,
                        centralGravity: 0.3,
                        springLength: 120,
                        springConstant: 0.04,
                        damping: 0.09,
                        avoidOverlap: 0
                    },
                    stabilization: {
                        enabled: true,
                        iterations: 5000    // YMMV
                    }
                },
                // physics: false,
                //用于所有用户与网络的交互。处理鼠标和触摸事件以及导航按钮和弹出窗口
                interaction: {
                    hover: true,
                    dragNodes: true, //是否能拖动节点
                    dragView: true, //是否能拖动画布
                    // hover: true, //鼠标移过后加粗该节点和连接线
                    //multiselect: true, //按 ctrl 多选
                    selectable: true, //是否可以点击选择
                    selectConnectedEdges: true, //选择节点后是否显示连接线
                    hoverConnectedEdges: true, //鼠标滑动节点后是否显示连接线
                    zoomView: true //是否能缩放画布
                },
            };
            this.network = new Vis.Network(container, data, options);
            this.network.on('selectNode', (params) => {
                // 显示悬停内容
                console.log('select', params.nodes[0])
                let id = params.nodes[0];
                this.generate_node_info(id);
            });
            this.knowlegGraphshow = false
            console.log(this.knowlegGraphshow)
        },
        check() {

            var div = document.getElementById("network_id");
            if (div) {
                //元素存在的操作代码
                console.log("div元素存在");
            } else {
                //元素不存在的操作代码
                console.log("div元素不存在");
            }

        },
        async Graph_construct() {
            //const url = 'http://192.168.137.224:9876/graphconstruct';
            const data = {
                index: this.caseData.host,
                log_id: 'Ergjj5IBEVwjil-CwCF3',
                timerange: [1, 'h', 1, 'h']
            };
            //console.log(data);

            let res = await GraphConstruct({
                index: this.caseData.host,
                log_id: this.log_data.log_id,
                timerange: [1, 'h', 1, 'h']
            });


            //var query = 'USE auditd1d2aa7781797521fe75b4d56c98220911 MATCH p=()-->() RETURN p';
            var query = 'USE ' + this.log_data.host + '1' + ' MATCH p=()-->() RETURN p';
            this.executeCypher(query);
        },
        generate_node_info(id) {

        },
        onSubmit() {
            this.getnodelog();
        },
        async getnodelog() {
            let nodelog = await getNodeLog();
            let this_node = {}
            for (let log of nodelog) {
                if (log.log_id == this.caseData.log_id) {
                    this_node = log;
                }
            }
            if (this.value != 'all') {
                let res = await SubGraphConstruct({
                    index: this.caseData.host,
                    node: this_node.vertex,
                    direction: this.value,
                    hop: 3,
                    time: this_node.timestamp
                });
            }


        }

    },
    mounted() {
        this.getRootCase();
        this.timer = setInterval(this.check, 3000);
        var query = 'USE sysmonwin71 MATCH p=()-->() RETURN p'

        //this.executeCypher(query);
        console.log(this.knowlegGraphshow);
        console.log(this.caseData.host);
    },
    beforeDestroy() {
        clearInterval(this.timer);
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