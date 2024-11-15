<template>
    <div>
        <div class="header1">
            <h3>
                neo4j画图
            </h3>
        </div>

        <div class="wrapper1" v-loading="this.knowlegGraphshow">
            <div id="network_id" ref="network_id" class="network" style="height: 700px;border: 1px solid black;">
            </div>
        </div>
    </div>
</template>

<script>
const Vis = require('vis-network/dist/vis-network.min');
require('vis-network/dist/dist/vis-network.min.css');
var neo4j = require("neo4j-driver");
export default {

    data() {
        return {
            echartsNode: [],
            nodesRelation: [],
            category: [],
            clearAll: false,
            nodesArray: [],
            echartsData: [],
            edgesArray: [],
            knowlegGraphshow: true,
            records: [],

        }
    },
    methods: {
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
                let nodename = [];
                for (let i = 0; i < me.records.length; i++) {
                    nodename.push({
                        id: me.records[i]._fields[0].segments[0].relationship.startNodeElementId,
                        name: me.records[i]._fields[0].segments[0].start.properties.name,
                        inode: me.records[i]._fields[0].segments[0].start.properties.inode,
                        type: me.records[i]._fields[0].segments[0].start.labels[0]
                    });
                    nodename.push({
                        id: me.records[i]._fields[0].segments[0].relationship.endNodeElementId,
                        name: me.records[i]._fields[0].segments[0].end.properties.name,
                        inode: me.records[i]._fields[0].segments[0].end.properties.inode,
                        type: me.records[i]._fields[0].segments[0].end.labels[0]
                    });
                }

                nodes.forEach((e) => {
                    console.log('1');

                    for (let i = 0; i < nodename.length; i++) {
                        if (e == nodename[i].id) {
                            if (nodename[i].name != null) {
                                this.echartsData.push({
                                    label: nodename[i].name,
                                    id: e,
                                });
                                break;
                            }
                            if (nodename[i].inode != null) {
                                this.echartsData.push({
                                    label: nodename[i].inode,
                                    id: e,
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
                    multiselect: true, //按 ctrl 多选
                    selectable: true, //是否可以点击选择
                    selectConnectedEdges: true, //选择节点后是否显示连接线
                    hoverConnectedEdges: true, //鼠标滑动节点后是否显示连接线
                    zoomView: true //是否能缩放画布
                },
            };
            this.network = new Vis.Network(container, data, options);
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

        }
    },
    mounted() {
        this.timer = setInterval(this.check, 3000);
        var query = 'MATCH p=()-->() RETURN p'
        this.executeCypher(query);
        console.log(this.knowlegGraphshow);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    }
}
</script>

<style lang="less" scoped>
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
</style>