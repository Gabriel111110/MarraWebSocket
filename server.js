const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io'); // importazione oggetto Server da socket.io
const conf = JSON.parse(fs.readFileSync("./conf.json"));

let userList = [];




app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/", express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
   //punto 2 
   //metto in ascolto il socket col set_username e lo assegno ad user e poi lo pusho in userList
   socket.on("set_username", (username) => {
      const user={
         socketId: socket.id,
         name: username
       };
      userList.push(user);
      io.emit("chat", "benvenuto all'interno della chat " + username);
      io.emit("list", userList); // invio la lista aggiornata
   });

   // punto 3 sostituisco il socket.id col username
   socket.on("message", (message) =>{
      let username="";
      let found=false;
      for(let i=0; i<userList.length; i++){
         if(userList[i].socketId==socket.id){
            username=userList[i].name;
            found=true;
         }
      }
      if(found){
        const response = username + ': ' + message;
        io.emit("chat", response);
      }
   });
   // punto 7 disconnessione
   socket.on('disconnect', () => {
      let found = false; 
      let username = ''; 
      for (let i = 0; i < userList.length; i++) {
         if (userList[i].socketId === socket.id) {
            found = true;
            username = userList[i].name; 
            userList.splice(i, 1);
            io.emit("chat", { username: 'Server', message: `${username} ha lasciato la chat.`});
            io.emit("list", userList);
            break;
         }
      }
   });
   

});



server.listen(conf.port, () => {
    console.log("server running on port: " + conf.port);  
    console.log(userList);
});