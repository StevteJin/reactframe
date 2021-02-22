const http = require('http');
const sio = require('socket.io');
const fs = require('fs');

const server = http.createServer((req,res) => {
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(fs.readFileSync('./index.html'));
})

server.listen(1337)

//创建socket服务器
const socket = sio.listen(server);

//监听客户端的连接状态
socket.on('connetion',(socket) => {
    console.log('客户端建立链接！');
    //发送给客户端数据
    socket.emit('你好!');
    //监听客户端发送过来的数据
    socket.on('message',(msg) => {
        console.log('接收到一个信息',msg);
    })
    socket.on('disconnect',()=>{
        console.log('客户端断开连接')
    })
})
