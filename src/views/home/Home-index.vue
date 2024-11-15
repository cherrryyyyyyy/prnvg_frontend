<template>
  <div>
    <div class="header2">
      <h3>
        首页
      </h3>
    </div>
    <div class="wrapper2">
      <el-row>
        <el-col :span="24">
          <div class="grid-content">
            <h1>
              主机个数：{{ this.num }}
            </h1>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <h1>
              威胁情况
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
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <h1>
              事件概览
            </h1>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div>
            <div class="echart" id="mycharttimeline" :style="myChartStyle"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <div class="echart" id="mychartcases" :style="myChartStyle"></div>
          </div>
        </el-col>

      </el-row>

    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getLogs } from '@/axios/api'
import { getAlert } from '@/axios/api';

export default {
  data() {
    return {
      num: 0,
      myChartStyle: { float: "left", width: "70%", height: "250px" }, //图表样式
      threatlogs: [],
      myChartStyle1: { float: "left", width: "100%", height: "400px" }, //图表样式
      tactics: [],
      host: '',
      hosts: [],
      case_log: [],
      case_logg: [],
      case_timeline: [],
      case_count: [],
      solve_timeline: [],
      solve_count: []
    }
  },
  methods: {
    gethosts() {
      let hosts = new Set()
      for (let log of this.threatlogs) {
        hosts.add(log.host);
      }
      let hostss = Array.from(hosts);
      for (let item of hostss) {
        let host = {
          value: item,
          label: item
        }
        this.hosts.push(host);
      }
      this.host = this.hosts[0].value;
      console.log('hosts', this.hosts)
      this.num = this.hosts.length;

    },
    async GetThreatLogs() {
      let res = await getLogs();
      this.threatlogs = res;
      console.log('threatlog', this.threatlogs);
      let tactics = new Set();
      for (let items of this.threatlogs) {
        tactics.add(items.tactic_id);
      }
      let tacticss = Array.from(tactics)
      this.tactics = tacticss;
      console.log('tactics', this.tactics);
      this.gethosts();
      this.initSankey();
      this.getcasetimeline();
      this.initEchartslogs();

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
      let op = [];

      let con = 0;
      for (let host of this.hosts) {
        let op1 = 0;
        for (let items of this.threatlogs) {
          for (let data of allData) {
            if (items.tactic_id == data.name && items.host == host.value) {
              data.value += 1;
              op1 += 1;
            }
          }
        }
        op.push(op1);
        con += 1;
      }
      //console.log('op', op);
      let con1 = 0;
      for (let host of this.hosts) {
        let text = {
          name: host.value,
          value: op[con1],
          depth: 0,
          itemStyle: { color: '' }
        };
        text.itemStyle.color = this.getRandomColor();
        allData.push(text);
        con1 += 1;
      }
      console.log('allDATA', allData);
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
      let jishu = [];
      for (let host of this.hosts) {
        for (let tactic of this.tactics) {
          let text = {
            name: host.value,
            value: 0,
            target: tactic
          };
          jishu.push(text);
        }
      }
      for (let log of this.threatlogs) {
        for (let ji of jishu) {
          if (log.host == ji.name) {
            if (log.tactic_id == ji.target) {
              ji.value += 1;
            }
          }
        }
      }
      console.log('jishu', jishu);

      for (let ji of jishu) {
        if (ji.value != 0) {
          let text = {
            source: ji.name,
            target: ji.target,
            value: ji.value,
          };
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
    initEchartstimeline() {
      const option3 = {
        title: {
          text: "事件创建时间线",
          x: "center",
          textStyle: {
            fontSize: 20, // 默认值：18
            fontStyle: "italic", // normal:正常风格（默认值）,italic:倾斜体
            fontWeight: "bold", // normal:正常粗细（默认值）,bold/bolder:粗体,lighter:正常粗细
          },
        },
        xAxis: {
          name: '时间',
          type: 'category',
          data: this.case_timeline
        },
        yAxis: {
          type: 'value',
          name: '事件个数'
        },
        series: [
          {
            type: 'line',
            data: this.case_count,
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
    async getcasetimeline() {
      let res = await getAlert();
      this.case_log = res;
      for (let log of this.case_log) {
        if (log.is_escalated == 1) {
          this.case_logg.push(log);
        }
      }
      console.log('case_log', this.case_logg);
      let temp_timeline = [];
      let time = new Set();
      for (let log of this.case_logg) {
        const dateObject = new Date(log.create_time); // 用T替换空格，以符合ISO格式
        const year = dateObject.getFullYear();         // 获取年份
        const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // 获取月份并格式化为两位数
        const day = String(dateObject.getDate()).padStart(2, '0');         // 获取日期并格式化为两位数
        const formattedDate = `${year}-${month}-${day}`;
        time.add(formattedDate);
      }
      console.log(time);
      for (let timee of time) {
        let text = {
          'time': timee,
          'case_count': 0
        };
        temp_timeline.push(text);
      }
      for (let log of this.case_logg) {
        const dateObject = new Date(log.create_time); // 用T替换空格，以符合ISO格式
        const year = dateObject.getFullYear();         // 获取年份
        const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // 获取月份并格式化为两位数
        const day = String(dateObject.getDate()).padStart(2, '0');         // 获取日期并格式化为两位数
        const formattedDate = `${year}-${month}-${day}`;
        for (let timeline of temp_timeline) {
          if (timeline.time == formattedDate) {
            timeline.case_count += 1;
          }
        }
      }
      for (let timee of temp_timeline) {
        this.case_timeline.push(timee.time);
        this.case_count.push(timee.case_count);
      }
      console.log(this.case_timeline, this.case_count);
      /*-------------------------------------------------------------------------------------------------*/
      let case_close = [];
      for (let log of this.case_log) {
        if (log.is_opened == 0 && log.is_escalated == 1) {
          case_close.push(log);
        }
      }
      console.log('close',case_close);


      this.initEchartstimeline();
      this.initEchartslogs();
    },
    initEchartslogs() {
      const option2 = {
        title: {
          text: "事件解决统计",
          x: "center",
          textStyle: {
            fontSize: 20, // 默认值：18
            fontStyle: "italic", // normal:正常风格（默认值）,italic:倾斜体
            fontWeight: "bold", // normal:正常粗细（默认值）,bold/bolder:粗体,lighter:正常粗细
          },
        },
        xAxis: {
          name: '日期',
          data: this.solve_timeline
        },
        yAxis: { name: '事件解决个数', },
        series: [
          {
            type: 'bar',
            data: this.solve_count,
            label: {
              // 柱状图上方文本标签，默认展示数值信息
              show: true,
              position: "top"
            },
            barWidth: "30%", // 每个柱条的宽度就是类目宽度的 20%
          }
        ]
      };
      this.myChartlog = echarts.init(document.getElementById("mychartcases"));
      this.myChartlog.setOption(option2);
      window.addEventListener("resize", () => {
        this.myChartlog.resize();
      });
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
}
</script>

<style lang="less" scoped>
.header2 {
  height: 55px;
  border-bottom: 2px solid black;
  display: flex;
  align-items: center;
  color: antiquewhite;
  background: #091527;

}

.wrapper2 {
  padding: 10px;

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #ffffff;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .bg-blue-light {
    background: rgb(237, 245, 253);
  }

  .bg-green-light {
    background: rgb(241, 253, 241);
  }

  .bg-pup-light {
    background: rgb(241, 240, 254);
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
}
</style>