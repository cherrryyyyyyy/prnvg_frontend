<template>

    <div>
        <div class="header">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <el-dropdown trigger="click" :hide-on-click="true">
                            <el-button type="primary">
                                选择源<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown" class="lang-select-dropdown">
                                <el-dropdown-item v-for="host in this.hosts" :key="host.value"
                                    @click.native="refresh(host.value)">
                                    {{ host.value }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </el-col>
                <el-col :span="11">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="open">点击添加查询对象</el-button>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" icon="el-icon-search" style="text-align: left;"
                            @click="Search">搜索</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="wrapper">
            <el-col :span="1.5" v-for="(item, key) in columns">
                <el-card @click.native="handleClick" shadow="hover" :class="{ customcard1: judge[key] }">
                    <h3>{{ item }}</h3>
                </el-card>
                <div v-for="(item, key1) in rows[key]">
                    <el-popover placement="top-start" width="400" trigger="hover" @show="show(key1)">
                        <el-table :data="dData">
                            <el-table-column width="150" property="external_references[0].external_id"
                                label="攻击技术id"></el-table-column>
                            <el-table-column width="200" property="description" label="描述"
                                show-overflow-tooltip="true"></el-table-column>
                        </el-table>
                        <el-card @click.native="handleClick(key1)" shadow="hover" :class="{ customcard: datas[key1] }"
                            slot="reference" v-if="test(datas[key1], key)">
                            <el-row>
                                <el-col :span="23">
                                    {{ item }}
                                </el-col>
                                <el-col :span="1">
                                    <el-badge :value="datas[key1]" class="item">
                                        <p>&nbsp;&nbsp;</p>
                                    </el-badge>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-popover>
                </div>
                <div v-for="(item, key1) in rows[key]">
                    <el-popover placement="top-start" width="400" trigger="hover" @show="show(key1)">
                        <el-table :data="dData">
                            <el-table-column width="150" property="external_references[0].external_id"
                                label="攻击技术id"></el-table-column>
                            <el-table-column width="200" property="description" label="描述"
                                show-overflow-tooltip="true"></el-table-column>
                        </el-table>
                        <el-card @click.native="handleClick(key1)" shadow="hover" :class="{ customcard: datas[key1] }"
                            slot="reference" v-if="!datas[key1]">
                            <el-row>
                                <el-col :span="23">
                                    {{ item }}
                                </el-col>
                                <el-col :span="1">
                                    <el-badge :value="datas[key1]" class="item">
                                        <p>&nbsp;&nbsp;</p>
                                    </el-badge>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-popover>
                </div>
            </el-col>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { getLogs } from '@/axios/api'
export default {
    data() {
        return {
            value: '10',
            checked: true,
            optionss: [],
            threatlogs: [],
            hosts: [],
            techniques: [],
            dData: [
            ],
            columns: {
                'TA0043': '侦察目标',
                'TA0042': '资源准备',
                'TA0001': '初始访问',
                'TA0002': '攻击执行',
                'TA0003': '持续控制',
                'TA0004': '权限提升',
                'TA0005': '防御规避',
                'TA0006': '凭据访问',
                'TA0007': '环境观察',
                'TA0008': '横向移动',
                'TA0009': '收集信息',
                'TA0011': '命令与控制',
                'TA0010': '窃取数据',
                'TA0040': '侵害破坏'
            },
            rows: {
                'TA0043': {
                    'T1595': '主动扫描',
                    'T1592': '收集受害者主机信息',
                    'T1589': '收集受害者身份信息',
                    'T1590': '收集受害者网络信息',
                    'T1591': '收集受害者组织信息',
                    'T1598': '网络钓鱼获取信息',
                    'T1597': '搜索闭源',
                    'T1596': '搜索开放技术数据库',
                    'T1593': '搜索开放网站/域',
                    'T1594': '搜索受害者拥有的网站'
                },
                'TA0042': {
                    'T1650': '获取访问权限',
                    'T1583': '获取基础架构',
                    'T1586': '泄露帐户',
                    'T1584': '折衷基础架构',
                    'T1587': '发展能力',
                    'T1585': '建立账户',
                    'T1588': '获取能力',
                    'T1608': '舞台功能',
                },
                'TA0001': {
                    'T1189': '偷渡式妥协',
                    'T1190': '利用面向公众的应用程序',
                    'T1133': '外部远程服务',
                    'T1200': '硬件添加',
                    'T1566': '网络钓鱼',
                    'T1091': '通过可移动媒体进行复制',
                    'T1195': '供应链妥协',
                    'T1199': '信任关系',
                    'T1078': '有效帐户'
                },
                'TA0002': {
                    'T1651': '云管理命令',
                    'T1059': '命令和脚本解释器',
                    'T1609': '容器管理命令',
                    'T1610': '部署容器',
                    'T1203': '利用客户端执行',
                    'T1559': '进程间通信',
                    'T1106': '原生接口',
                    'T1053': '计划任务/作业',
                    'T1648': '无服务器执行',
                    'T1129': '共享模块',
                    'T1072': '软件部署工具',
                    'T1569': '系统服务',
                    'T1204': '用户执行',
                    'T1047': 'WMI服务'
                },
                'TA0003': {
                    'T1098': '账户操纵',
                    'T1197': '位作业',
                    'T1547': '启动或登录自动启动执行',
                    'T1037': '启动或登录初始化脚本',
                    'T1176': '浏览器扩展',
                    'T1554': '泄露客户端软件二进制文件',
                    'T1136': '创建帐户',
                    'T1543': '创建或修改系统进程',
                    'T1546': '事件触发的执行',
                    'T1133': '外部远程服务',
                    'T1574': '劫持执行流程',
                    'T1525': '植入物内部图像',
                    'T1556': '修改身份验证过程',
                    'T1137': '办公应用程序启动',
                    'T1542': '预操作系统启动',
                    'T1053': '计划任务/作业',
                    'T1505': '服务器软件组件',
                    'T1205': '交通信号',
                    'T1078': '有效帐户'
                },
                'TA0004': {
                    'T1548': '滥用提升控制机制',
                    'T1134': '访问令牌操作',
                    'T1547': '启动或登录自动启动执行',
                    'T1037': '启动或登录初始化脚本',
                    'T1543': '创建或修改系统进程',
                    'T1484': '域策略修改',
                    'T1611': '逃生到主机',
                    'T1546': '事件触发的执行',
                    'T1068': '利用特权升级',
                    'T1574': '劫持执行流程',
                    'T1055': '工艺注入',
                    'T1053': '计划任务/作业',
                    'T1078': '有效账户'
                },
                'TA0005': {
                    'T1548': '滥用提升控制机制',
                    'T1134': '访问令牌操作',
                    'T1197': '位作业',
                    'T1612': '在主机上构建映像',
                    'T1622': '调试器规避',
                    'T1140': '对文件或信息进行解密/解码',
                    'T1610': '部署容器',
                    'T1006': '直接卷访问',
                    'T1484': '域策略修改',
                    'T1480': '执行护栏',
                    'T1211': '用于防御规避的利用',
                    'T1222': '文件和目录权限修改',
                    'T1564': '隐藏工件',
                    'T1574': '劫持执行流程',
                    'T1562': '损害防御',
                    'T1070': '指标移除',
                    'T1202': '间接命令执行',
                    'T1036': '伪装',
                    'T1556': '修改身份验证过程',
                    'T1578': '修改云计算基础架构',
                    'T1112': '修改注册表',
                    'T1601': '修改系统映像',
                    'T1599': '网络边界桥接',
                    'T1027': '混淆的文件或信息',
                    'T1647': 'Plist文件修改',
                    'T1542': '预操作系统启动',
                    'T1055': '工艺注入',
                    'T1620': '反射代码加载',
                    'T1207': '恶意域控制器',
                    'T1014': '根套件',
                    'T1553': '颠覆信任控制',
                    'T1218': '系统二进制代理执行',
                    'T1216': '系统脚本代理执行',
                    'T1221': '模板注入',
                    'T1205': '交通信号',
                    'T1127': '受信任的开发人员实用程序代理执行',
                    'T1535': '未使用/不支持的云区域',
                    'T1550': '使用备用身份验证材料',
                    'T1078': '有效帐户',
                    'T1497': '虚拟化/沙盒规避',
                    'T1600': '削弱加密',
                    'T1220': 'XSL 脚本处理',
                },
                'TA0006': {
                    'T1557': '中间的对手',
                    'T1110': '蛮 力',
                    'T1555': '密码存储中的凭据',
                    'T1212': '利用凭据访问',
                    'T1187': '强制身份验证',
                    'T1606': '伪造网络凭据',
                    'T1056': '输入捕获',
                    'T1556': '修改身份验证过程',
                    'T1111': '多重身份验证拦截',
                    'T1621': '多重身份验证请求生成',
                    'T1040': '网络嗅探',
                    'T1003': '操作系统凭据转储',
                    'T1528': '窃取应用程序访问令牌',
                    'T1649': '窃取或伪造身份验证证书',
                    'T1558': '偷或伪造科贝罗斯门票',
                    'T1539': '窃取网络会话Cookie',
                    'T1552': '不安全的凭据',
                },
                'TA0007': {
                    'T1087': '帐户发现',
                    'T1010': '应用程序窗口发现',
                    'T1217': '浏览器信息发现',
                    'T1580': '云基础架构发现',
                    'T1538': '云服务仪表板',
                    'T1526': '云服务发现',
                    'T1619': '云存储对象发现',
                    'T1613': '容器和资源发现',
                    'T1622': '调试器规避',
                    'T1652': '设备驱动程序发现',
                    'T1482': '域信任发现',
                    'T1083': '文件和目录发现',
                    'T1615': '组策略发现',
                    'T1046': '网络服务发现',
                    'T1135': '网络共享发现',
                    'T1040': '网络嗅探',
                    'T1201': '密码策略发现',
                    'T1120': '外围设备发现',
                    'T1069': '权限组发现',
                    'T1057': '进程发现',
                    'T1012': '查询注册表',
                    'T1018': '远程系统发现',
                    'T1518': '软件发现',
                    'T1082': '系统信息发现',
                    'T1614': '系统位置发现',
                    'T1016': '系统网络配置发现',
                    'T1049': '系统网络连接发现',
                    'T1033': '系统所有者/用户发现',
                    'T1007': '系统服务发现',
                    'T1124': '系统时间发现',
                    'T1497': '虚拟化/沙盒规避',
                },
                'TA0008': {
                    'T1210': '利用远程服务',
                    'T1534': '内部鱼叉式网络钓鱼',
                    'T1570': '横向刀具转移',
                    'T1563': '远程服务会话劫持',
                    'T1021': '远程服务',
                    'T1091': '通过可移动媒体进行复制',
                    'T1072': '软件部署工具',
                    'T1080': '污点共享内容',
                    'T1550': '使用备用身份验证材料',
                },
                'TA0009': {
                    'T1557': '中间的对手',
                    'T1560': '存档收集的数据',
                    'T1123': '音频捕获',
                    'T1119': '自动收集',
                    'T1185': '浏览器会话劫持',
                    'T1115': '剪贴板数据',
                    'T1530': '来自云存储的数据',
                    'T1602': '来自配置存储库的数据',
                    'T1213': '来自信息存储库的数据',
                    'T1005': '来自本地系统的数据',
                    'T1039': '来自网络共享云端硬盘的数据',
                    'T1025': '来自可移动媒体的数据',
                    'T1074': '数据暂存',
                    'T1114': '电子邮件收集',
                    'T1056': '输入捕获',
                    'T1113': '屏幕截图',
                    'T1125': '视频捕获',
                },
                'TA0011': {
                    'T1071': '应用层协议',
                    'T1092': '通过可移动媒体进行通信',
                    'T1132': '数据编码',
                    'T1001': '数据混淆',
                    'T1568': '动态分辨率',
                    'T1573': '加密通道',
                    'T1008': '回退通道',
                    'T1105': '入口工具传输',
                    'T1104': '多级通道',
                    'T1095': '非应用层协议',
                    'T1571': '非标端口',
                    'T1572': '协议隧道',
                    'T1090': '代理',
                    'T1219': '远程访问软件',
                    'T1205': '交通信号',
                    'T1102': '网络服务'
                },
                'TA0010': {
                    'T1020': '自动渗透',
                    'T1030': '数据传输大小限制',
                    'T1048': '替代协议的渗透',
                    'T1041': '通过 C2 通道渗出',
                    'T1011': '通过其他网络介质进行外泄',
                    'T1052': '物理介质上的渗漏',
                    'T1567': '通过 Web 服务进行渗透',
                    'T1029': '定时接送',
                    'T1537': '将数据传输到云帐户'
                },
                'TA0040': {
                    'T1531': '帐户访问权限删除',
                    'T1485': '数据销毁',
                    'T1486': '为影响而加密的数据',
                    'T1565': '数据操作',
                    'T1491': '污损',
                    'T1561': '磁盘擦除',
                    'T1499': '终端拒绝服务',
                    'T1495': '固件损坏',
                    'T1490': '抑制系统恢复',
                    'T1498': '网络拒绝服务',
                    'T1496': '资源劫持',
                    'T1489': '服务停止',
                    'T1529': '系统关机/重启',
                }
            },
            datas: {
            },
            judge: {
                'TA0043': false,
                'TA0042': false,
                'TA0001': false,
                'TA0002': false,
                'TA0003': false,
                'TA0004': false,
                'TA0005': false,
                'TA0006': false,
                'TA0007': false,
                'TA0008': false,
                'TA0009': false,
                'TA0011': false,
                'TA0010': false,
                'TA0040': false
            },

        };
    },
    methods: {
        test(data, key) {
            //console.log('panduan', key);
            if (data != null) {
                this.judge[key] = true;
                return true;
            }
            return false;
        },
        showPopover() {
            console.log('show');
        },
        handleClick(key1) {
            console.log('Click', key1);
            this.showdetail(key1);
        },
        showdetail(val) {
            this.$router.push(
                {
                    path: '/matrix/detail',
                    query: { index: val }
                })
        },
        show(key1) {
            this.dData = [];
            this.getjson(key1);
            console.log(this.dData);
        },
        async getjson(key1) {
            this.dData = [];
            await axios.get('http://' + location.host + '/technique/' + key1 + '.json').then((res) => {
                console.log(res.data.objects[0], 'res');
                if (res.status == 200) {
                    // data = res.data.data.userList;
                    this.dData.push(res.data.objects[0]);
                } else {
                    alert('数据获取失败');
                }
            });
            console.log('gridData', this.dData);
        },
        Search() {
            console.log('search!!');
        },
        open() {
            this.$prompt('请输入查询对象index', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                //inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                //inputErrorMessage: '格式不正确'
            }).then(({ value }) => {
                this.$message({
                    type: 'success',
                    message: '成功添加对象: ' + value
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        async GetThreatLogs() {
            let res = await getLogs();
            this.threatlogs = res;
            console.log(this.threatlogs);
            this.gethosts();
            let techniques = new Set();
            for (let items of this.threatlogs) {
                techniques.add(items.technique_id);
            }
            let techniquess = Array.from(techniques)
            this.techniques = techniquess;
            for (let technique of this.techniques) {
                console.log(technique);
                this.datas[technique] = 0;
            }
            for (let item of this.threatlogs) {
                for (let technique in this.datas) {
                    if (item.technique_id == technique && item.host == this.hosts[0].value) {
                        this.datas[technique]++;
                    }
                }
            }
            console.log(this.datas);

        },
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
            console.log(this.hosts)
        },
        refresh(host) {
            console.log(host);
            this.judge={
                'TA0043': false,
                'TA0042': false,
                'TA0001': false,
                'TA0002': false,
                'TA0003': false,
                'TA0004': false,
                'TA0005': false,
                'TA0006': false,
                'TA0007': false,
                'TA0008': false,
                'TA0009': false,
                'TA0011': false,
                'TA0010': false,
                'TA0040': false
            }
            this.datas = {};
            for (let item of this.threatlogs) {
                if (item.host == host) {
                    this.datas[item.technique_id] = 0;
                }
            }
            for (let item of this.threatlogs) {
                for (let technique in this.datas) {
                    if (item.technique_id == technique && item.host == host) {
                        this.datas[technique]++;
                    }
                }
            }
        }
    },
    created() {
        this.GetThreatLogs();
    }
}
</script>

<style>
.header {
    width: 170%;
    justify-content: space-between;
    /* 设置超出滚动 */
    overflow-x: auto;
    height: 55px;
    border-bottom: 2px solid black;
    display: flex;
    align-items: center;
    color: antiquewhite;
    background: #091527;

}

.wrapper {
    width: 170%;
    justify-content: space-between;
    /* 设置超出滚动 */
    overflow-x: auto;
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

.customcard1 {
    background-color: aqua;
}
</style>