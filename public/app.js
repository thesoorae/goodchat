

document.addEventListener("DOMContentLoaded", () => {
  const msg = document.getElementById('input');
  const log = document.getElementById('messages');
  const button = document.getElementById('chat-button');
  let conn = null;

    function appendLog(item) {
      log.appendChild(item);
    }


    button.onclick = function () {
      console.log("clicked");
        if (!conn) {
            return false;
        }
        if (!msg.value) {
            return false;
        }
        conn.send(msg.value);
        msg.value = "";
        return false;
    };
    if (window["WebSocket"]) {
      console.log("in websocket");
        conn = new WebSocket('ws://' + window.location.host + '/ws');
        conn.onclose = function (evt) {
          console.log("in onclose");
            var item = document.createElement("div");
            item.innerHTML = "<b>Connection closed.</b>";
            appendLog(item);
        };
        conn.onmessage = function (evt) {
          console.log("in onmessage");
            var messages = evt.data.split('\n');
            for (var i = 0; i < messages.length; i++) {
                var item = document.createElement("div");
                item.innerText = messages[i];
                appendLog(item);
            }
        };
    } else {
        var item = document.createElement("div");
        item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
        appendLog(item);
    }
});
