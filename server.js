const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io'); // importazione oggetto Server da socket.io
const conf = JSON.parse(fs.readFileSync("./conf.json"));

let userList = [];
let user={
  socketId: "",
  name: ""
};
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
      user.socketId = socket.id;
      user.name = username;
      userList.push(user);
      io.emit("chat", "tutti gli user: " + userList);
   });

   socket.on('message', (message) => {
      const response = socket.id + ': ' + message;
      console.log(response);
      io.emit("chat", response);
   });
});


server.listen(conf.port, () => {
    console.log("server running on port: " + conf.port);  
    console.log(userList);
});