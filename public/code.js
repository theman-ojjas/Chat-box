(function(){
    const app=document.querySelector(".app");
    const socket=io();

    let uname;
    let lat1;
    let lng1;
    const usernameMap = new Map();
    // let lat2;
    // let lng2;
    let socketId=socket.id;

    // app.querySelector(".join-screen #join-user").addEventListener("click", function() {
    //     console.log("Button clicked");
    //     // ... rest of your code
    // });

    // socket.on('connect', () => {
    //     console.log('Connected to server');
    // });
      
    
    // socket.on('disconnect', () => {
    //     console.log('Disconnected from server');
    // });

    
    app.querySelector(".join-screen #join-user").addEventListener("click",function(){
        console.log("join button clicked");
        let username=app.querySelector(".join-screen #username").value;
        let latitude=app.querySelector(".join-screen #latitude").value;
        let longitude=app.querySelector(".join-screen #longitude").value;
        if(username.length==0||latitude==0||longitude==0){
            return;
        }
        socket.emit("newuser", { username, latitude, longitude });
        uname=username;
        lat1=latitude;
        lng1=longitude;

        // // socket.emit("location",{lat1,lng1});
        // console.log(longitude);
        // console.log(latitude);
        console.log(username+" has connected");
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click",function(){

        let username=app.querySelector(".join-screen #username").value;
        let latitude=app.querySelector(".join-screen #latitude").value;
        let longitude=app.querySelector(".join-screen #longitude").value;
        
        let message= app.querySelector(".chat-screen #message-input").value;
        if (message == null || message.length === 0) {

            return;
        }
        console.log("Button send clicked");
        renderMessage("my",{
            username:uname,
            text:message
        });
        socket.emit("chat",{
            username:uname,
            text:message

        });
        app.querySelector(".chat-screen #message-input").value="";
        
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
        socket.emit("exituser",uname);
        window.location.href=window.location.href;
    });

    
    // socket.on("location", function(data) {
    //     const { lat2, lng2 } = data;
    //     console.log(`Received location from server - Latitude: ${lat2}, Longitude: ${lng2}`);
        
    //     // Update lat2 and lng2 with the received values
    //     lat2 = lat2;
    //     lng2 = lng2;
    //     // Now you can use lat2 and lng2 in your client-side logic as needed
    // });

    // //   console.log("hello");

    // socket.on("update", function(users) {
    //     console.log("Received update with user locations:", users);
    
    //     // Assuming lat1 and lng1 are the coordinates of the current user
    //     users.forEach(user => {
    //         const { username, latitude, longitude } = user;
    //         const distanceToUser = distance(lat1, lng1, latitude, longitude);
    
    //         if (distanceToUser <= 1) {
    //             console.log(`${username} is within 1 km range.`);
    //         }
    //     });
    // });
    
    // // Add event listener for the "chat" event once
    // socket.on("chat", function(message) {
    //     // Only render messages from users within 1 km range
    //     if (message.username !== uname) {
    //         renderMessage("other", message);
    //     }
    // });
    
    // socket.on("getlocation",function(data){
    //     const{latitude,longitude}=data;
    //     lat2=latitude;
    //     lng2=longitude;
    // });
    
    // socket.on("newClient",function(data){
    //     const {username,latitude,longitude}=data;
    //     let lat2=latitude;
    //     let lng2=longitude;
    //     let nname=username;

    //     console.log(distance(lat1,lng1,lat2,lng2));
    //     console.log(isValidDistance(lat1,lng1,lat2,lng2)); 
        
    //     if(isValidDistance(lat1,lng1,lat2,lng2)&&nname!==uname)
    //     {
    //         console.log("valid");
    //     socket.on("update",function(update){
    //         renderMessage("update",update);
    //     });

        
    //     }
    // });

    usernameMap.set(socketId,uname);

    socket.on("newClient",function(data){
        const{username,socketIdo,latitude,longitude}=data;
        console.log(username+" in newclient"+latitude);
        let lat2=latitude;
        let lng2=longitude;
        calculateDistance=distance(lat1,lng1,lat2,lng2);
        console.log(calculateDistance);
        
        if(calculateDistance<=1.0){
            // username.set(socketIdo,username);
            console.log("i m in");
        }
    });
    
    socket.on("update",function(update){
                renderMessage("update",update);
            });

    socket.on("chat",function(message){
        renderMessage("other",message);
    });

    // if(isValidDistance(lat1,lng1,lat2,lng2))
    //     {
    //     socket.on("update",function(update){
    //         renderMessage("update",update);
    //     });

    //     socket.on("chat",function(message){
    //         renderMessage("other",message);
    //     });
    //     }



    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type === "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type === "other") {
            let el = document.createElement("div");
            console.log("messa")
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type === "update") {
            console.log("up date")
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

    // function getLocation(){

    // }
    function distance(lat1, lng1, lat2, lng2){
        const earthRadius = 6371; // Earth radius in kilometers

        // Convert latitude and longitude from degrees to radians
        const lat1Rad = toRadians(lat1);
        const lng1Rad = toRadians(lng1);
        const lat2Rad = toRadians(lat2);
        const lng2Rad = toRadians(lng2);
    
        // Calculate differences
        const dLat = lat2Rad - lat1Rad;
        const dLng = lng2Rad - lng1Rad;
    
        // Haversine formula
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        // Distance in kilometers
        const distance = earthRadius * c;
    
        return distance;
    }
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    function isValidDistance(lat1, lng1, lat2, lng2){
       if(distance(lat1, lng1, lat2, lng2)<=1) return true;
       else return false;
    }
    
    

    
    
})();