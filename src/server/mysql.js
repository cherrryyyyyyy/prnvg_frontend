
const mysql = require('mysql')
//连接数据库的配置信息
const db_config = {
	host: 'localhost', //本地都是localhost
	user: 'remote', //账户名
	password: '123456', //密码
	port: '3306', //端口号
	database: 'all_process_test' //数据库的名称
}

function conMysql(sql) {
	//创建数据库连接池
	let Myconnect = mysql.createConnection(db_config)
	//开始连接数据库


	Myconnect.connect(function (err) {
		if (err) {
			console.log(`myqsl连接失败:${err}!`)
		} else {
			console.log('恭喜哦，mysql连接成功哦')
		}
	})

	//因为query查询是一个异步操作，所以用promise来操作
	return new Promise((resolve, reject) => {
		//query() 函数用于mysql语句查询
		Myconnect.query(sql, (err, result) => {
			if (err) {
				reject(err)
			} else {
				let res = JSON.parse(JSON.stringify(result))
				closeMysql(Myconnect)  //调用函数关闭mysql连接
				resolve(res)
			}
		});
	})
}

function queMysqlinsert(sql, value) {
	//创建数据库连接池
	let Myconnect = mysql.createConnection(db_config)
	//开始连接数据库
	Myconnect.connect(function (err) {
		if (err) {
			console.log(`myqsl连接失败:${err}!`)
		} else {
			console.log('恭喜哦，mysql连接成功哦')
		}
	})
	//因为query查询是一个异步操作，所以用promise来操作
	sql = 'INSERT ignore into escalate_log (log_id, is_escalated,is_open,create_time,rule_id,rule_name,severity,tactic_id,technique_id,host) values' + ' (' + '\'' + value.log_id + '\'' + ',' + false + ',' + false + ',' + null + ',\'' + value.rule_id + '\'' + ',\'' + value.rule_name + '\'' + ',\'' + value.severity + '\'' + ',\'' + value.tactic_id + '\'' + ',\'' + value.technique_id + '\'' + ',\'' + value.host + '\'' + ')'
	console.log(sql);
	return new Promise((resolve, reject) => {
		//query() 函数用于mysql语句查询
		Myconnect.query(sql, (err, result) => {
			if (err) {
				reject(err)
			} else {
				let res = JSON.parse(JSON.stringify(result))
				closeMysql(Myconnect)  //调用函数关闭mysql连接
				resolve(res)
			}
		});
	})

}

function queMysqlupdate(sql, value) {
	//创建数据库连接池
	let Myconnect = mysql.createConnection(db_config)
	//开始连接数据库
	const now = new Date();
	const formattedTime = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
	console.log(formattedTime);
	Myconnect.connect(function (err) {
		if (err) {
			console.log(`myqsl连接失败:${err}!`)
		} else {
			console.log('恭喜哦，mysql连接成功哦')
		}
	})
	//console.log(value);
	//因为query查询是一个异步操作，所以用promise来操作
	sql = 'UPDATE escalate_log SET is_escalated = 1, is_open = 1,create_time = ' + '\'' + formattedTime + '\'' + ',case_name = ' + '\'' + value.case_name + '\'' + ',case_id = ' + '\'' + value.case_id + '\'' + ' WHERE log_id = "' + value.log_id + '"'
	console.log(sql);
	return new Promise((resolve, reject) => {
		//query() 函数用于mysql语句查询
		Myconnect.query(sql, (err, result) => {
			if (err) {
				reject(err)
			} else {
				let res = JSON.parse(JSON.stringify(result))
				closeMysql(Myconnect)  //调用函数关闭mysql连接
				resolve(res)
			}
		});
	})

}

//关闭mysql数据库的函数
function closeMysql(Myconnect) {
	Myconnect.end((err) => {
		if (err) {
			console.log(`mysql关闭失败:${err}!`)
		} else {
			console.log('mysql关闭成功')
		}
	})
}

function queMysqlupdatecase(sql, value) {
	//创建数据库连接池
	let Myconnect = mysql.createConnection(db_config)
	//开始连接数据库
	Myconnect.connect(function (err) {
		if (err) {
			console.log(`myqsl连接失败:${err}!`)
		} else {
			console.log('恭喜哦，mysql连接成功哦')
		}
	})
	//因为query查询是一个异步操作，所以用promise来操作
	sql = 'UPDATE escalate_log SET disposal_record = "' + value.text + '", is_open = 0 WHERE case_id = "' + value.case_id + '"'
	console.log(sql);
	return new Promise((resolve, reject) => {
		//query() 函数用于mysql语句查询
		Myconnect.query(sql, (err, result) => {
			if (err) {
				reject(err)
			} else {
				let res = JSON.parse(JSON.stringify(result))
				closeMysql(Myconnect)  //调用函数关闭mysql连接
				resolve(res)
			}
		});
	})
}

//导出conMysql函数
exports.conMysql = conMysql
exports.queMysqlinsert = queMysqlinsert
exports.queMysqlupdate = queMysqlupdate
exports.queMysqlupdatecase = queMysqlupdatecase