

document.addEventListener("DOMContentLoaded", () => {
  const msg = document.getElementById('input');
  const log = document.getElementById('messages');
  const button = document.getElementById('chat-button');
  let conn = null;

    function appendLog(item) {

        log.appendChild(item);

    }
    button.onclick = function () {
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
        conn = new WebSocket('ws://' + window.location.host + '/ws');
        conn.onclose = function (evt) {
            var item = document.createElement("div");
            item.innerHTML = "<b>Connection closed.</b>";
            appendLog(item);
        };
        conn.onmessage = function (evt) {
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
