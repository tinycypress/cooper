import { Server } from "socket.io";
import Socket from "./socket";

export default function configureWS(server) {
  // Create an instance with reference to socket io server.
  Socket.ws = new Server(server, {
    serveClient: false,
    cors: { origin: '*' }
  });

  // Handle incoming connections, mainly here for debugging.
  Socket.ws.on('connection', (socket) => {
    console.log('a user connected');


    Socket.ws.emit('Testing?')
  });
}