package main



// import (
//   "log"
//   "net/http"
//   "github.com/gorilla/websocket"
//   "os"
// )
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
import (
  "log"
  "net/http"
  "github.com/gorilla/websocket"
  "sync"

)

var clients = make(map[*websocket.Conn]User)
var onlineusers = make(map[*websocket.Conn]string)
var broadcast = make(chan Message)
var upgrader = websocket.Upgrader{}
var usersbroadcast = make(chan UserList)
// CurrentUsers []string `json:'allusers'`

type Message struct{
  NewUser string `json:"newuser"`
  Username string `json:"username"`
  Message string `json:"message"`
  UserLeft string `json:"userleft"`
}

type UserList struct {
  CurrentUsers []string `json:'currentusers'`
}
type User struct {
  Username string `json:"username"`
  Socket *websocket.Conn
  mu sync.Mutex
}

func (u * User) send(v interface{}) error{
  u.mu.Lock()
  defer u.mu.Unlock()
  return u.Socket.WriteJSON(v)
}


// func (userlist *UserList) AddUser(user User) []User{
//   userlist.Users = append(userlist.Users, user)
//   return userlist.Users
// }

func main(){
  //file server
  fs := http.FileServer(http.Dir("./public"))
  http.Handle("/", fs)
  http.HandleFunc("/ws", handleConnections)
  go handleMessages()
  go handleUsers()
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

  newuser :=User{Socket: ws}
  clients[ws] = newuser

  for{
    var msg Message
    err := ws.ReadJSON(&msg)
      if err != nil {
        log.Printf("error: %v", err)
        delete(clients, ws)
        break
      }
    if msg.NewUser != "" {
      client := clients[ws]
      client.Username = msg.NewUser
      var users []string
      for _, value := range clients{
        users = append(users, value.Username)
      }

      updatedusers := UserList{CurrentUsers: users}
      usersbroadcast <- updatedusers
    }
    broadcast <- msg
  }
}

func handleUsers(){
  for{
    userlist := <- usersbroadcast
    for _, client := range clients {
      log.Printf("users list: %v", userlist)

      err := client.send(userlist)
      if err != nil {
        log.Printf("error: %v", err)
        client.Socket.Close()
        delete(clients, client.Socket)
      }
    }
  }
}

func handleMessages() {
   for {
     msg := <-broadcast

     for _, client := range clients {
       err := client.send(msg)
       if err != nil {
         log.Printf("error: %v", err)
         client.Socket.Close()
         delete(clients, client.Socket)
       }
     }
   }
}



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
