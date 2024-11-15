
const express = require('express')
const app = express()

const cors = require('express') //解决跨域问题
app.use(cors())

const bodyParser = require('body-parser')
const multiparty = require('connect-multiparty')
// 处理 x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// 处理 mutipart/form-data
app.use(multiparty())
// 处理 application/json
app.use(bodyParser.json())
//导入我们上一步写的连接数据库的函数
const {conMysql, queMysqlinsert, queMysqlupdate, queMysqlupdatecase} = require('./mysql')
//创建统一的返回报文对象
class Response {
	constructor(isSucceed, msg, code, data) {
		this.isSucceed = isSucceed;
		this.msg = msg;
		this.code = code;
		this.data = data;
	}
}


//一个简单的测试接口
app.get('/test',(req,res)=>{
    res.send('测试用的接口')
})

//一个简单的接口，查询数据库中的信息
app.get('/getLogs', (req, res) => {
	let sql = 'select * from threat_logs'
	//console.log(req.query.param.id);
	conMysql(sql).then(result => {
		res.send(result)
	})
	
})

app.get('/getNodeLog', (req, res) => {
	let sql = 'select * from threat_graph_info'
	//console.log(req.query.param.id);
	conMysql(sql).then(result => {
		res.send(result)
	})
	
})

app.get('/getAlert', (req, res) => {
	let sql = 'select * from escalate_log'
	//console.log(req.query.param.id);
	conMysql(sql).then(result => {
		res.send(result)
	})
	
})

app.get('/update_escalated_log', (req, res) => {
	const sql = '';
	//let value = req.query.param
	let value = req.query.param;
	queMysqlinsert(sql,value).then(result => {
		res.send(result)
	})

	
})
app.get('/update_escalated', (req, res) => {
	const sql = '';
	//let value = req.query.param
	let value = req.query.param;
	queMysqlupdate(sql,value).then(result => {
		res.send(result)
	})

	
})


app.get('/update_case_log', (req, res) => {
	const sql = '';
	//let value = req.query.param
	let value = req.query.param;
	queMysqlupdatecase(sql,value).then(result => {
		res.send(result)
	})

	
})

//监听node服务器的端口号
app.listen(3000, () => {
	console.log('恭喜你，服务器启动成功')
})