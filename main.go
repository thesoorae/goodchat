package main



// import (
//   "log"
//   "net/http"
//   "github.com/gorilla/websocket"
//   "os"
// )

import (
  "log"
  "net/http"
  "github.com/gorilla/websocket"

)

var clients = make(map[*websocket.Conn]bool)
var onlineusers = make(map[*websocket.Conn]string)
var broadcast = make(chan Message)
var upgrader = websocket.Upgrader{}
var usersbroadcast = make(chan User)

type Message struct{
  // Email string `json:"email"`
  NewUser string `json:"newuser"`
  Username string `json:"username"`
  Message string `json:"message"`
  UserLeft string `json:"userleft"`
}

type User struct {
  Username string `json:"username"`
}
// func determineListenAddress() (string, error) {
//   port := os.Getenv("PORT")
//
//   return ":" + port, nil
// }
//
// func main() {
//   fs := http.FileServer(http.Dir("./public"))
//   http.Handle("/", fs)
//   addr, err := determineListenAddress()
//   if err != nil {
//     log.Fatal(err)
//   }
//   // http.HandleFunc("/", hello)
//   http.HandleFunc("/ws", handleConnections)
//   go handleMessages()
//   log.Printf("Listening on %s...\n", addr)
//   if err := http.ListenAndServe(addr, nil); err != nil {
//   panic(err)
//   }
// }

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

func handleConnections(w http.ResponseWriter, r *http.Request){
  ws, err := upgrader.Upgrade(w, r, nil)
  if err != nil{
    log.Fatal(err)
  }
  defer ws.Close()
  clients[ws] = true


  // for{
  //   var newuser User
  //   err := ws.ReadJSON(&newuser)
  //   if err! = nil {
  //     log.Printf("error: %v", err)
  //     delete(clients, ws)
  //     break
  //   }
  //   userbroadcast <- newuser
  // }

  for{
    var msg Message
    err := ws.ReadJSON(&msg)
    if err != nil {
      log.Printf("error: %v", err)
      delete(clients, ws)
      break
    }

    broadcast <- msg
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

// func getUsers(){
//   for{
//     users := <-usersbroadcast
//     for client := range clients {
//          err := client.WriteJSON(newuser)
//          if err!=nil {
//            log.Printf("error: %v", err)
//            client.Close()
//            delete(clients, client)
//          }
//        }
//   }
// }
// func handleUsers(){
//   for {
//     newuser := <-userbroadcast
//     for client := range clients {
//       err := client.WriteJSON(newuser)
//       if err!=nil {
//         log.Printf("error: %v", err)
//         client.Close()
//         delete(clients, client)
//       }
//     }
//   }
// }

// func handler(w http.ResponseWriter, r *http.Request){
//   fmt.Fprintf(w, "Hi there, I love %s!", r.URL.Path[1:])
// }
//
// func main() {
//   http.HandleFunc("/", handler)
//   http.ListenAndServe(":8080", nil)
//
// }

// New code to test user?
//
