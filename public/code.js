(function(){
    const app=document.querySelector(".app");
    const socket=io();
    let uname;
    let lat1;
    let lng1;
    
    let socketId=socket.id;

                                //  Comment this for manual input of coordinates  //
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
             lat1 = position.coords.latitude;
             lng1 = position.coords.longitude;
            console.log(`Latitude: ${lat1}, Longitude: ${lng1}`);
        }, function(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.error("User denied the request for geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.error("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    console.error("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    console.error("An unknown error occurred.");
                    break;
            }
        });
    } else {
        console.error("Geolocation is not available in this browser.");
    }
                            // . . . . . . . . . . . . . . . . . . . . . . . . . . //

                            // uncomment the code that is commented for manual input.

    app.querySelector(".join-screen #join-user").addEventListener("click",function(){
        console.log("join-button clicked");
        let username=app.querySelector(".join-screen #username").value;
        let latitude=lat1;
        let longitude=lng1;

        // latitude=app.querySelector(".join-screen #latitude").value;
        // longitude=app.querySelector(".join-screen #longitude").value;

        if(username.length==0||latitude==0||longitude==0){
            return;
        }
        socket.emit("newuser", { username, latitude, longitude });
        uname=username;
        lat1=latitude;
        lng1=longitude;

        console.log(username+" has connected");
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click",function(){

        let username=app.querySelector(".join-screen #username").value;
        let latitude=lat1;
        let longitude=lng1;

    
        
        // latitude=app.querySelector(".join-screen #latitude").value;
        // longitude=app.querySelector(".join-screen #longitude").value;

        let message= app.querySelector(".chat-screen #message-input").value;
        if (message == null || message.length === 0) {
            return;
        }
        console.log("send-button clicked");
        renderMessage("my",{
            username:uname,
            text:message
        });
        socket.emit("chat",{username:uname,text:message,latitude:latitude,longitude:longitude});
        app.querySelector(".chat-screen #message-input").value="";
        
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
        let username=uname;
        let latitude=lat1;
        let longitude=lng1;
        socket.emit("exituser",{username, latitude,longitude});
        
        window.location.href=window.location.href;
    });

    
    socket.on("update",function(data){
        const { update,latitude,longitude } = data;
        let lat2=latitude;
        let lng2=longitude;
        calculateDistance=distance(lat1,lng1,lat2,lng2);
        if(calculateDistance<=1.0){
            renderMessage("update",update);
        }
            });

    socket.on("chat",function(message){
        let lat2=message.latitude;
        let lng2=message.longitude;
        calculateDistance=distance(lat1,lng1,lat2,lng2);   
        if(calculateDistance<=1.0){
            renderMessage("other",message);
        }
    });

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
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type === "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

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