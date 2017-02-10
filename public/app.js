
document.addEventListener("DOMContentLoaded", function(){


  const input = document.getElementById('input');
  const log = document.getElementById('messages');
  const form = document.getElementById('form');
  const usernameInput = document.getElementById('user-input');
  const userList = document.getElementById('user-list');
  var modal = document.getElementById('myModal');

  // const username = document.getElementById('username');
  var conn;
  let user = null;
  let currentUsers = [];

  conn = new WebSocket('ws://' + window.location.host + '/ws');
  window.conn = conn;

//
  function appendLog(item) {
    let doScroll = log.scrollTop === log.scrollHeight - log.clientHeight;
    log.insertBefore(item, log.firstChild);
    if (doScroll) {
      log.scrollTop = log.scrollHeight - log.clientHeight;
    }
  }
//
//

  document.getElementById('user-form').onsubmit = function(){
    if(!conn){
      return false;
    }

    user = usernameInput.value;
    conn.send(JSON.stringify({newuser: user}));
    document.getElementById('user-title').innerHTML = "@" + user;
    modal.style.display = "none";

    return false;
  };

  document.getElementById('form').onsubmit = function () {
      if (!conn) {
          return false;
      }

        conn.send(JSON.stringify({username: user, message: input.value}));
        input.value = "";
        input.placeholder = "";



      return false;
  };

    function userImage(username){
      if(username !== ""){
      var elem = document.createElement("img");
      elem.src = 'https://robohash.org/' + username +'.png';
      elem.setAttribute("height", "50");
      elem.setAttribute("width", "50");
      return elem;}
    }

    function renderUser(list, username){
      var img = userImage(username);
      var userDiv = document.createElement("div");
      userDiv.id = "user-item";
      userDiv.appendChild(img);
      var userName = document.createElement('div');
      userName.innerHTML = username;
      userDiv.appendChild(userName);
      list.appendChild(userDiv);
    }

    function removeUser(username){
      var item = document.getElementById(username);
      item.remove();
    }

    function timeNow() {
      var d = new Date(),
          h = (d.getHours()<10?'0':'') + d.getHours(),
          m = (d.getMinutes()<10?'0':'') + d.getMinutes();
          return h + ':' + m;
    }
    function renderMsg(username, msg) {
      var img = userImage(username);
      var item = document.createElement("div");
      item.classList.add('message');
      var messageBody = document.createElement("div");
      messageBody.className = "message-body";
      var nameTime = document.createElement("div");
      var namediv = document.createElement("div");
      var timediv = document.createElement("div");
      nameTime.className = "nameTime";
      namediv.className="name";
      timediv.className="time";
      var time = new Date(new Date().getTime()).toLocaleTimeString();
      namediv.innerHTML = username;
      timediv.innerHTML = time;

      nameTime.appendChild(namediv);
      nameTime.appendChild(timediv);
      var msgItem = document.createElement("div");
      msgItem.innerHTML = msg;
      messageBody.appendChild(nameTime);
      messageBody.appendChild(msgItem);
      item.appendChild(img);
      item.appendChild(messageBody);

      return item;
    }




    if (window["WebSocket"]) {
        conn = new WebSocket('ws://' + window.location.host + '/ws');
        window.conn = conn;


        conn.onclose = function (evt) {

            var item = document.createElement("div");
            item.innerHTML = "<b>Connection closed.</b>";
            appendLog(item);
        };


        window.onbeforeunload = function(e){
          conn.send(JSON.stringify({userleft: user}));

        }

        const onmessage = function (evt) {

          var broadcast = JSON.parse(evt.data);
          window.broadcast = broadcast;
          if (broadcast.CurrentUsers) {
            userList.innerHTML = '';
            var cu = broadcast.CurrentUsers.filter(function(u){
              return !(u == "");});
            cu.forEach(function(us){
              renderUser(userList, us);
            });




          } else {
                var item = renderMsg(broadcast.username, broadcast.message)
                appendLog(item);
          }
          // if(currentUsers.length == 1 && !currentUsers.includes("Eliza")){
          //   setTimeout(elizaInitial, 3000);
          // }

        };


        conn.addEventListener('message', onmessage);



    } else {
        var item = document.createElement("div");
        item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
        appendLog(item);
    }
//
});
