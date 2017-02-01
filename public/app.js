
document.addEventListener("DOMContentLoaded", () => {


  const input = document.getElementById('input');
  const log = document.getElementById('messages');
  const form = document.getElementById('form');
  // const username = document.getElementById('username');
  const userlist = document.getElementById('users');
  var conn;
  let user = null;

  conn = new WebSocket('ws://' + window.location.host + '/ws');
  window.conn = conn;


// conn.onmessage = function (evt) {
//   console.log("in onmessage", evt.data);
//     var messages = evt.data.split('\n');
//
//
//     // for (var i = 0; i < messages.length; i++) {
//     //     var item = document.createElement("div");
//     //     item.innerText = messages[i];
//     //     appendLog(item);
//     // }
// };
//
// function open(e){  if(ws){
//     return false;
//   }
//   ws = new WebSocket("{{.}}");
//   ws.onopen = function(e){
//     print ("Open");
//   }
//   ws.onclose = function(e){
//     print ("close");
//     ws = null;
//   }
//   ws.onmessage = function(e){
//     print("Response:" + e.data);
//   }
//   ws.onerror = function(e){
//     print("Error" + evt.data);
//   }
//   return false;
// }
//
//

//
    function appendLog(item) {
      let doScroll = log.scrollTop === log.scrollHeight - log.clientHeight;
      log.appendChild(item);
      if (doScroll) {
        log.scrollTop = log.scrollHeight - log.clientHeight;
      }
    }
//
//
    document.getElementById('form').onsubmit = function () {
      console.log("clicked");
      window.msg = input.value;
      window.conn = conn;
        if (!conn) {
            return false;
        }
        if(!user){
          user = input.value;
          conn.send(JSON.stringify({newuser: input.value}));
          console.log("Send: " + input.value);
          input.placeholder = "Message";

          return false
        } else {
          conn.send(JSON.stringify({username: user, message: input.value}));
          console.log("Send: " + input.value);

        }

        return false;
    };

    function renderUser(username){
      var item = document.createElement("div");
      item.id = username;
      item.innerHTML = username;
      document.getElementById('user-list').appendChild(item);
    }

    function removeUser(username){
      var item = document.getElementById(username);
      item.remove();
    }

    function renderMsg(username, msg) {
      var item = document.createElement("div");
      var user = document.createElement("h2");
      user.innerHTML = username;
      var msgItem = document.createElement("div");
      msgItem.innerHTML = msg;
      item.appendChild(user);
      item.appendChild(msgItem);
      return item;
    }




    if (window["WebSocket"]) {
      console.log("in websocket");
        conn = new WebSocket('ws://' + window.location.host + '/ws');
        window.conn = conn;


        conn.onclose = function (evt) {
          console.log("in onclose");

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
          console.log("in onmessage", broadcast);
          if(broadcast.newuser !== ""){
            console.log("new user entered", broadcast.newuser);
            renderUser(broadcast.newuser);
          } else if (broadcast.userleft !== ""){
            console.log("user left", broadcast.userleft);
            removeUser(broadcast.userleft);
          } else {
            // for (var i = 0; i < messages.length; i++) {
                var item = renderMsg(broadcast.username, broadcast.message)
                appendLog(item);
            // }
          }
        };

        // const newuser = function(e){
        //   var newuser = JSON.parse(e.data);
        //   window.newuser = newuser;
        //   console.log("in newuser");
        //   addUser(newuser.username);
        // }

        conn.addEventListener('message', onmessage);


    } else {
        var item = document.createElement("div");
        item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
        appendLog(item);
    }
//
});
