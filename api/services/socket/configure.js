import { Server } from "socket.io";
import Socket from "./socket";

// Remove players after a few minutes of inactivity?
const players = [];

const playerConnected = socket => {
  const player = {
    id: socket.id,

    // TODO: Randomise these two properties and check no conflict/identical.
    color: 'red',
    // Pass the z? Solution?
    position: { x: 0, y: 0, z: 0 }
  }

  // Start tracking new player.
  players.push(player);

  // Inform all users someone connected.
  Socket.ws.emit('player_recognised', player);
}

export default function configureWS(server) {
  // Create an instance with reference to socket io server.
  Socket.ws = new Server(server, {
    serveClient: false,
    cors: { origin: '*' }
  });

  // Handle incoming connections, mainly here for debugging.
  Socket.ws.on('connection', playerConnected);

  // TODO:
  // Add an event listener for moving which broadcasts to all other users.
}