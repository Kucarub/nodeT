var ws = require("nodejs-websocket"),
WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 5040 });
console.log("开始建立连接...")


/* socketId */
let id = 0
let onlineMemberList = []
let defaultUser = 'user'

let StatusResponse={
    "code":200,
    "msg":'',
    "socketId":0
}


wss.on('connection',function (ws,req) {
    id++
    ws.id = id
    let reqUser = req.url.split('?')[1]
    let name = reqUser && reqUser.split('=')[1]
    let userName;
    if(name){
        userName = decodeURIComponent(name)
    }else {
        userName = defaultUser + id
    }
    let userInfo = {
        userName: userName,
        socketId: id,
        date: new Date()
    }
    console.log(wss.clients.size)
    if(wss.clients.size>2){
        return;
    }
    /* 当用户名一样的时候，表示重新登录 */
    for (let i = 0; i < onlineMemberList.length; i++) {
        if (userInfo.userName === onlineMemberList[i].userName) {
            StatusResponse["code"]=500
            StatusResponse["msg"]='用户名重复'
            onlineMemberList[i] = userInfo
            console.log(onlineMemberList)
            ws.send(JSON.stringify(StatusResponse))
            /*wss.clients.forEach(itemWs => {
                itemWs.send(JSON.stringify(StatusResponse))
            })*/
            return
        }
    }

    onlineMemberList.push(userInfo)
    if(wss.clients.size===2){
        StatusResponse["code"]=0
        StatusResponse["msg"]='already'
        StatusResponse["socketId"]=userInfo.socketId
        wss.clients.forEach(itemWs => {
            itemWs.send(JSON.stringify(StatusResponse))
        })
    }else {
        return;
    }
    /*wss.clients.forEach(itemWs => {
        itemWs.send(JSON.stringify(onlineMemberList))
    })*/
    // console.log(userInfo)
    ws.on('message',function (msg) {
        console.log(msg)
        if(msg.indexOf('msg')!==-1){
            StatusResponse["code"]=200
            StatusResponse["msg"]=msg
            ws.send(JSON.stringify(StatusResponse))
        }else {
            StatusResponse["code"]=999
            StatusResponse["msg"]=msg
            wss.clients.forEach(itemWs => {
                if(itemWs.id!==JSON.parse(msg).socketId){
                    itemWs.send(JSON.stringify(StatusResponse))
                }
            })
        }

    })

    /* 监听客户端关闭 */
    ws.on('close', function (ev) {
        console.log('客户端断开连接')
    })

    /* 监听客户端发生异常 */
    ws.on('error', function (ev) {
        console.log('客户端异常')
    })
})
wss.on('text',function (ws,req) {
    console.log(ws)
    console.log(req)
})
