import { Server } from "socket.io";
import Socket from "./socket";

export default function configureWS(server) {
  // Create an instance with reference to socket io server.
  Socket.ws = new Server(server, {
    serveClient: false,
    cors: { origin: '*' }
  });

  // Remove players after a few minutes of inactivity?
  const players = [];

  // Handle incoming connections, mainly here for debugging.
  Socket.ws.on('connection', (socket) => {
    console.log('a user connected');
    const player = {
      id: socket.id
    }

    // Start tracking new player.
    players.push(player);

    // Inform all users someone connected.
    Socket.ws.emit('player_recognised', {
      // TODO: Randomise these two properties and check no conflict/identical.
      color: 'red',
      position: {
        x: 0,
        y: 0
      }
    });
  });

  // TODO:
  // Add an event listener for moving which broadcasts to all other users.
}