import { Server } from "socket.io";
import Socket from "./socket";

export default function configure(server) {
    Socket.ws = new Server(server);

    Socket.ws.on('connection', (socket) => {
      console.log('a user connected');
    });
}