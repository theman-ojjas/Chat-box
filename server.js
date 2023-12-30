const express=require("express");
const path=require("path");

const app=express();
const server=require("http").createServer(app);

const io=require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")));

io.on("connection",function(socket){

    const socketIdo = socket.id;

    socket.on("newuser",function(data){

        const{username,latitude,longitude}=data;
        console.log("entered newuser server")

        socket.broadcast.emit("newClient",{username,socketIdo,latitude, longitude });

        socket.broadcast.emit("update",username + " has joined the conversation");
        // console.log(`Current lat2: ${lat2}, Current lng2: ${lng2}`);
    });
    socket.on("exituser",function(username){
        socket.broadcast.emit("update",username+" has left the conversation");
    });
    socket.on("chat",function(message){

        // const{message,latitude,longitude}=data;
        // socket.emit("newClient",{latitude, longitude });
        socket.broadcast.emit("chat",message);
    });
    // socket.on("location",function (data) {
    //     const { lat1, lng1 } = data;
    //     socket.emit("getlocation",function(data))
    //     console.log(`Received location from client - Latitude: ${lat1}, Longitude: ${lng1}`);
    //   });
});

const PORT=5500;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});