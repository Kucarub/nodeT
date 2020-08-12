var mysql = require('mysql');
var express = require('express');
var cors = require('cors');
var router = express.Router();
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var app = http.createServer();

var writeOut = function (query, res) {
    query = JSON.stringify(query);
    res.write(query);
    res.end();
};
let bbb = function (query) {
    let promise = new Promise(function (resolve, reject) {
        const connection = mysql.createConnection({
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '',
            database: 'test'
        });
        const name = query.userName;
        var delSql = "DELETE FROM user WHERE user =" + name + "";
        var addSql = 'INSERT INTO cardGroup(id,card,suit) VALUES(0,?,?)';
        var addSqlParams = [];
        var sql = "SELECT * FROM user WHERE user = '" + name + "'";
        connection.connect();
        connection.query(sql, function (err, result) {
            if (result) {
                console.log(result)
                resolve(result);
            }
            if (err) {
                console.log(err)
            }
            connection.end()
        });

    });
    promise.then(function (value) {
        return value;
        // success
    }, function (value) {
        // failure
    });
    return promise;
};

app.on('request', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild,token ');
    res.setHeader('Access-Control-Allow-Methods', '*');
    //1.通过判断url路径和请求方式来判断是否是表单提交
    if (req.url === "/abc" && req.method === 'POST') {
        res.writeHead(200, {'Content-Type': 'application/JSON;charset=utf-8'});
        /**服务端接收post请求参数的流程
         * （1）给req请求注册接收数据data事件（该方法会执行多次，需要我们手动累加二进制数据）
         *      * 如果表单数据量越多，则发送的次数越多，如果比较少，可能一次就发过来了
         *      * 所以接收表单数据的时候，需要通过监听 req 对象的 data 事件来取数据
         *      * 也就是说，每当收到一段表单提交过来的数据，req 的 data 事件就会被触发一次，同时通过回调函数可以拿到该 段 的数据
         * （2）给req请求注册完成接收数据end事件（所有数据接收完成会执行一次该方法）
         */
            //创建空字符叠加数据片段
            //2.注册data事件接收数据（每当收到一段表单提交的数据，该方法会执行一次）
        let postData = '';
        req.addListener("data", function (data) {
            postData += data;
        });
        req.addListener("end", function () {
            const ss = req.headers.token;
            console.log(ss);
            if (postData) {
                let query = JSON.parse(postData);
                bbb(query).then(function (data) {
                    let currentQuery = [];
                    if (data) {
                        for (let i = 0; i < data.length; i++) {
                            currentQuery.push({id: data[i].id})
                        }
                    }
                    console.log(currentQuery);
                    writeOut(currentQuery, res);
                });
            } else {
                let currentQuery = "fail";
                writeOut(currentQuery, res);
            }

        });
    } else {
        const errMessage = 404;
        writeOut(errMessage, res);
    }
});

app.listen(3000, "10.10.3.12", function () {

});
