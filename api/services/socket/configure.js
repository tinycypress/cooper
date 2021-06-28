import { Server } from "socket.io";
import Ground from "../../../operations/minigames/medium/conquest/ground";
import GroundHelper from "../../../operations/minigames/medium/conquest/groundHelper";
import { TIME } from "../../../origin/coop";
import Socket from "./socket";



export default function configureWS(server) {
  // Create an instance with reference to socket io server.
  Socket.conn = new Server(server, {
    serveClient: false,
    cors: { origin: '*' }
  });

  // Handle incoming connections, mainly here for debugging.
  Socket.conn.on('connection', GroundHelper.playerConnected);

  // TODO:
  // Add an event listener for moving which broadcasts to all other users.
  Socket.conn.on('player_moved', GroundHelper.playerMoved);
}