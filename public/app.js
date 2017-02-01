
document.addEventListener("DOMContentLoaded", () => {


  const msg = document.getElementById('input');
  const log = document.getElementById('messages');
  const form = document.getElementById('form');
  const username = document.getElementById('username');
  const userlist = document.getElementById('users');
  var conn;


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
      log.appendChild(item);
    }
//
//
    document.getElementById('form').onsubmit = function () {
      console.log("clicked");
      window.msg = msg.value;
      window.conn = conn;
        if (!conn) {
            return false;
        }
        console.log("Send: " + msg.value);
        conn.send(JSON.stringify({username: username.value, message: msg.value}));
        return false;
    };

    function renderUser(username){
      var item = document.createElement("div");
      item.innerHTML = username;
      return item;
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
        
        const onmessage = function (evt) {

          var msgText = JSON.parse(evt.data);
          window.msgText = msgText;
          console.log("in onmessage", msgText);
            // for (var i = 0; i < messages.length; i++) {
                var item = renderMsg(msgText.username, msgText.message)
                appendLog(item);
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
