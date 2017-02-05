# BetterChat

[Live Demo](https://betterchat.herokuapp.com/)

##Description

In the ever-changing, high-speed world of tech, clients are constantly demanding faster, more lightweight apps that can handle high volumes of server requests without error. Enter BetterChat, an agile, lightning fast communication tool built using one of the most exciting programming languages currently out there, Go. Golang is an open-source language with small runtime, simple framework, and concurrency primitives that allow for advanced, concurrent multi-thread handling. Betterchat will support concurrent readers and writers with the use of a third-party WebSockets package developed for Go (Gorilla Toolkit), and can optimize efficiency even under high load. GoodChat will also provide a pleasant, intuitive user interface built entirely in HTML5. While there are several examples of Go chat applications currently out there, very few, if any, come with a browser-supported user interface. BetterChat will make it easy for users to access the power of Go, without having to load and run programs locally from their command line.

Upon entering the site, you are greeted with a welcome modal that prompts the user for a username:

![Modal Demo](docs/modaldemo.png)

Users can chat with friends over the internet...

![Chat Demo](docs/Chatdemo.png)

...or with BetterChat's customized AI bot, Eliza, who parses user's messages and chooses from over 100+ responses depending on the context:

![Eliza Demo](docs/elizademo.png)


##Technologies
* Server architecture built using Go programming language
* Data is transferred from Server to Client using Websocket connections (through third-party package gorilla/websockets)
* Client-side is rendered using JavaScript and HTML5
* The skeleton for Eliza was integrated from [necrophonic's own implementation](https://github.com/necrophonic/go-eliza) of the [famous Eliza bot, first seen in 1964](https://en.wikipedia.org/wiki/ELIZA)
* Avatars unique to the user's IP address were provided from [Robohash.org](https://robohash.org/)
* Lastly, the project is deployed to Heroku for users to access easily from the internet

##Technical implementation

* For handling our incoming Websocket connections we created "handleConnections()". It first upgrades our initial GET request to a full on WebSocket. If there is an error, we log it but don't exit. This is followed by a defer statement that lets Go know to close out our WebSocket connection when the function returns. This saves us from writing multiple "Close()" statements depending on how the function returns.

Next we register our new client by adding it to the global "clients" map we created earlier.

```
func handleConnections(w http.ResponseWriter, r *http.Request){
  ws, err := upgrader.Upgrade(w, r, nil)
  if err != nil{
    log.Fatal(err)
  }
  defer ws.Close()
  clients[ws] = ""

```

This is followed by an infinite loop that continuously waits for a new message to be written to the WebSocket, unserializes it from JSON to a Message object and then throws it into the broadcast channel. Our "handleMessages()" goroutine (described below) can then take it can send it to everyone else that is connected.

If there is some kind of error with reading from the socket, we assume the client has disconnected for some reason or another. We log the error and remove that client from our global "clients" map so we don't try to read from or send new messages to that client.

Another thing to note is that HTTP route handler functions are run as goroutines. This allows the HTTP server to handle multiple incoming connections without having to wait for another connection to finish.

```
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
  ...
  ...
```

* We use a goroutine called "handleMessages()" to send each of our messages to the client. This is a concurrent process that will run along side the rest of the application that will only take messages from the broadcast channel from before and the pass them to clients over their respective WebSocket connection.

This is simply a loop that continuously reads from the "broadcast" channel and then relays the message to all of our clients over their respective WebSocket connection. Again, if there is an error with writing to the WebSocket, we close the connection and remove it from the "clients" map.

```
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
```


##Features to be Implemented in the Future

* Private Messaging

* Emojis

* Stored chats that persist to a database
