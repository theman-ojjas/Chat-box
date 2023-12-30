const express=require("express");
const path=require("path");

const app=express();
const server=require("http").createServer(app);

const io=require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")));

io.on("connection",function(socket){

    const socketIdo = socket.id;

    let lat2;
    let lng2;
    socket.on("newuser",function(data){
        const{username,latitude,longitude}=data;
        console.log(username + " entered the server")
        let update=`${username} has joined the conversation` ;
        socket.broadcast.emit("update",{update,latitude,longitude});
    });
    socket.on("exituser",function(data){
        const{username,latitude,longitude}=data;
        console.log(username+" left the server")
        let update=`${username} has left the conversation` ;
        socket.broadcast.emit("update",{update,latitude,longitude});
    });
    socket.on("chat",function(message){
        socket.broadcast.emit("chat",message);
    });

});

const PORT=5500;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});