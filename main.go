package main

//
//
// UNCOMMENT FOR HEROKU (BELOW)


import (
  "log"
  "net/http"
  "github.com/gorilla/websocket"
  "os"
  "time"
  "strings"
  eliza "goodchat/eliza"
)

func determineListenAddress() (string, error) {
  port := os.Getenv("PORT")

  return ":" + port, nil
}

func main() {
  fs := http.FileServer(http.Dir("./public"))
  http.Handle("/", fs)
  addr, err := determineListenAddress()
  if err != nil {
    log.Fatal(err)
  }
  // http.HandleFunc("/", hello)
  http.HandleFunc("/ws", handleConnections)
  go handleMessages()
  log.Printf("Listening on %s...\n", addr)
  if err := http.ListenAndServe(addr, nil); err != nil {
  panic(err)
  }
}

//// HEROKU DEPLOYMENT (ABOVE)

//UNCOMMENT FOR LOCAL HOST (BELOW)

import (
  "log"
  "net/http"
  "github.com/gorilla/websocket"
   eliza "./eliza"
 "strings"
  "time"

)
func main(){
  //file server
  fs := http.FileServer(http.Dir("./public"))
  http.Handle("/", fs)
  http.HandleFunc("/ws", handleConnections)
  go handleMessages()
  log.Println("http server started on :8000")
  err := http.ListenAndServe(":8000", nil)
  if err!= nil {
    log.Fatal("Listen and Serve: ", err)
  }
}

///////////LOCALHOST ABOVE


var clients = make(map[*websocket.Conn]string)
var broadcast = make(chan Message)
var upgrader = websocket.Upgrader{}

type Message struct{
  CurrentUsers []string `json:'currentusers'`
  NewUser string `json:"newuser"`
  Username string `json:"username"`
  Message string `json:"message"`
  UserLeft string `json:"userleft"`
}


func handleConnections(w http.ResponseWriter, r *http.Request){
  ws, err := upgrader.Upgrade(w, r, nil)
  if err != nil{
    log.Fatal(err)
  }
  defer ws.Close()
  clients[ws] = ""

  var elizaOn bool

  for{
    var msg Message
    var elizamsg Message

    err := ws.ReadJSON(&msg)
    if err != nil {
      log.Printf("error: %v", err)
      delete(clients, ws)
      break
    }
    log.Printf("The message %v", msg)

    if msg.NewUser != "" || msg.UserLeft != "" {
      if msg.NewUser != "" {
        clients[ws]= msg.NewUser
        if len(clients) == 4{
          elizaOn = true
          elizamsg.Username = "Eliza"
          elizamsg.Message = "Three's a crowd, I'm outta here."
        }
      }
      length := len(clients)
      usersArray := make([]string, length, 2 * length)
      for _, value := range clients{
        log.Printf("value", value)
        if value != msg.UserLeft {
          usersArray = append(usersArray, value)
        }
      }
      if length == 2 {
        usersArray = append(usersArray, "Eliza")
      }
      msg.CurrentUsers = usersArray

    }
    if len(clients) == 2 && strings.ToLower(msg.Message) == "eliza?" {
          elizaOn = true
          elizamsg.Username = "Eliza"
          elizamsg.Message ="I'm here! What do you want to talk about?"
        }

    if elizaOn && msg.Message != "" && msg.Message != "Eliza?"{
          response, err := eliza.AnalyseString(msg.Message)
          if err!= nil {
            panic(err)
          }
          elizamsg.Username = "Eliza"

          elizamsg.Message = response
        }
    if len(clients) == 4 && msg.Message != ""{
        elizaOn = false
      }

    broadcast <- msg
    if elizaOn {
    time.AfterFunc(1 * time.Second, func(){
        broadcast <- elizamsg})}
      }
    }





func handleMessages() {
   for {
     msg := <-broadcast
     for client := range clients {
       err := client.WriteJSON(msg)
       if err != nil {
         log.Printf("error: %v", err)
         client.Close()
         delete(clients, client)
       }
     }
   }
}
