const areaInserimentoNome = document.getElementById("inserimentoNome");
const nomeModale = document.getElementById("nomeModale");
const bottEntra = document.getElementById("entra");
const chat = document.getElementById("chat");
const input = document.getElementById("input");

const areaInserimentoMess = document.getElementById("areaInserimentoMess");
const inputMessaggio = document.getElementById("inputMessaggio");
const button = document.getElementById("sendMessage");
let nomeUser= null;

areaInserimentoMess.classList.add("hidden");
chat.classList.add("hidden");

const template = "<li class=\"list-group-item\">%MESSAGE</li>";
const messages = [];

const socket = io();

const entrataChat=()=>{
  const nome = nomeModale.value;
  if(nome.length>0){
    nomeUser = nome;
    socket.emit("message", "benvenuto all'interno della chat" + nomeUser);
    socket.emit("set_username", nomeUser);
    areaInserimentoNome.classList.remove("show");
    areaInserimentoNome.classList.add("hidden");

    areaInserimentoMess.classList.remove("hidden");
    areaInserimentoMess.classList.add("show");

    chat.classList.remove("hidden");
    chat.classList.add("show");

  }
}

bottEntra.onclick = () => {
  entrataChat();
}



inputMessaggio.onkeydown = (event) => {
  if (event.keyCode === 13) {
      event.preventDefault();
      button.click();
  }
}

button.onclick = () => {
  socket.emit("message", inputMessaggio.value);
  inputMessaggio.value = "";
}

socket.on("chat", (message) => {
  console.log(message);
  messages.push(message);
  render();
})

const render = () => {
  let html = "";
  messages.forEach((message) => {
    const row = template.replace("%MESSAGE", message);
    html+=row;
  });
  chat.innerHTML = html;
  window.scrollTo(0, document.body.scrollHeight);
}