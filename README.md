Testing

#GoodChat

##Background

In the ever-changing, high-speed world of tech, clients are constantly demanding faster, more lightweight apps that can handle high volumes of server requests without error. Enter GoodChat, an agile, lightning fast communication tool built using one of the most exciting programming languages currently out there, Go. Go programming language is an open-source language with small runtime, simple framework, and concurrency primitives that allow for advanced, concurrent multi-thread handling. Goodchat will support concurrent readers and writers with the use of a third-party WebSockets package developed for Go (Gorilla Toolkit), and can optimize efficiency even under high load. GoodChat will also provide a pleasant, intuitive user interface built on HTML5 and React.js. While there are several examples of Go chat applications currently out there, very few, if any, come with a browser-supported user interface. Goodchat will make it easy for users to access the power of Go, without having to load and run programs locally from their command line.

##Functionality & MVP

- [ ] Go Server Application that transfers data through WebSocket from Client to Channel
- [ ] Each client can send and receive messages in real-time
- [ ] Rendering of chat logs (persistence of information for each session)
- [ ] Deployed on publicly available web server (Heroku ?)
- [ ] Front-end rendering
- [ ] Attractive UI
- [ ] Production ReadMe

##Bonus
- [ ] AI Chatbot for responding to client input
- [ ] Can support multiple users in one chat
- [ ] Save chat logs to PostgreSQL or other DB
- [ ] Emojis and images
- [ ] Scroll through chat logs without interruption

##Wireframe
![Wireframe](/goodchat.png)

##Technologies & Technical Challenges

This application will be implemented using Go language, JavaScript, HTML5, and React.js elements.

The file structure will consist of the following:

Scripts:
```main.go``` the main entry point of the application
```app.js``` holds all JS code
```client.go``` handles client input logic
```channel.go``` handles chat "room" logic

HTML for Displaying Content:
```style.css``` for styling
```public/index.html``` for HTML5 rendering

The primary technical challenges will be:
- learning Go language in a brief period of time
- connecting application to equally fast, cloud-based web server (noticed that doesn't really exist right now so perceiving challenges in this realm)

##Group Members and Work Breakdown
Our group consists of two members, Soo-Rae Hong and Boris Grogg.

Soo-Rae's primary responsibilities will be:
- Researching and implementing connection to cloud based platform for hosting
- Styling of sidebar, navigation bar
- Research and implementation of multiple users on application
- Set up of Go application
- AI algorithms for chatbot (bonus)
- Storing persistent data (bonus)

Boris' primary responsibilities will be
- Research and implementation of Client and Chat inputs and outputs in Go
- Research and implementation of Gorilla WebSockets
- Styling of input and output components on front-end
- Different groups and threads (bonus)
- Emojis and other Materialize features (bonus)

##Implementation Timeline

**Day 1 & 2:** Install, set up Go, basic concurrent reading and writing functions implemented (with TCP connection?) Gorilla WebSockets, connection between goroutines (Pair Programming)
- Two goroutines can be connected on one channel
- Chat function sends a greeting to each connection
- Fully understand basic Go and Websockets functionality

**Day 3:** Concurrent reading and writing functions implemented (Pair Programming)
- Chat function copies data from one connection to the other through creation of another goroutine
- Error logging
- Closing connection and cleanup
- JSON files for data rendering
- Fully understand goroutines and concurrency as executed by Go

**Day 4:** Front end rendering with HTML and JavaScript  
- Completion of JS/React files to handle input and output
- Completion of JS/React files to handle user information
- Connect application to web host

**Day 5:**
- Fully styled
- Full Documentation
- Cleaned up source code
- Outreach to Go open source community
