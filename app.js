const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var bodyParser = require('body-parser');
// const router = express.Router();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/?chatroom', (req, res)=>{res.sendFile(__dirname + '/index.html')})
app.get('/welcome', (req, res)=>{res.sendFile(__dirname + '/index.html')})
app.post('/api/loginByUserName', (req, res)=>{
    username = req.body.user;
    console.log(username);
    res.json({msg: 'success', code:200});
})
// 记录聊天室在线人数
let onlinePeople = 0;
// let roomCreateAt = new Date().getTime();
// 记录每个socket实例
let socketObj = {};
let mySocket = {};
let msgHistory = [];
let userColor = ['#995fb2', '#58bd8f', '#bf7b2e', '#e24e27', '#409ad6']
// 候选颜色 ['#00bcd4', '#009688', '#4caf50', '#8bc34a', '#ffc107', '#607d8b', '#ff9800', '#ff5722'];
// let username;

io.on('connection', socket => { 
    onlinePeople++;
    mySocket[socket.id] = socket;
    // socket.emit('getUserId', socket.id);

    let username, color, room = [];
    socket.on('message', (msg)=>{
        if(username){
            // 不是第一次进入
            let private = msg.match(/@([^ ]+) (.+)/);
            if(private){
                // 如果是私聊就单独发
                let privateToUser = private[1];
                let content = private[2]
                let privateToSocket = socketObj[privateToUser];
                if(privateToSocket){
                    privateToSocket.send({
                        user:username,
                        content,
                        createAt: getCreateTime(new Date())
                    });
                }
            } else {
                // 不是私聊就群发
                let msgObj = {
                    user: username,
                    color,
                    content: msg,
                    id: socket.id,
                    createAt: getCreateTime(new Date())
                };
                io.emit('message', msgObj);
            }
        } else {
            // 第一次进入聊天室
            username = msg;
            socketObj[username] = socket;
            color = userColor[(Math.random() * userColor.length) >>> 0];
            let msgObj = {
                user: '系统',
                color,
                content: `"${username}" 加入了聊天`,
                id: socket.id,
                createAt: getCreateTime(new Date())
            }
            socket.broadcast.emit('message', msgObj);
        }
    });
    socket.on('typing', msg=>{
        socket.broadcast.emit('typing', msg);
    })
});


function getCreateTime(time) {
    return `${time.getHours()>=10?time.getHours():'0' + time.getHours()}:${time.getMinutes()>=10?time.getMinutes():'0' + time.getMinutes()}:${time.getSeconds()>=10?time.getSeconds():'0' + time.getSeconds()}`
}

server.listen(10000, ()=>{console.log('server listening in 10000');
})