import { Server } from "socket.io";
import GroundHelper from "../../../operations/minigames/medium/conquest/groundHelper";
import Socket from "./socket";

export default function configureWS(server) {
  // Create an instance with reference to socket io server.
  Socket.conn = new Server(server, {
    serveClient: false,
    cors: { origin: '*' }
  });

  // Handle incoming connections, mainly here for debugging.
  Socket.conn.on('connection', GroundHelper.playerConnected);
}