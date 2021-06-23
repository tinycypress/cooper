import { Server } from "socket.io";
import Socket from "./socket";

const tileLength = 15;
const _randNum = () => Math.floor((Math.random() * tileLength) + -tileLength);
const _randRGBComp = () => Math.max(150, Math.abs(_randNum()));

// Remove players after a few minutes of inactivity?
const players = [];

const playerConnected = socket => {
  const player = {
    id: socket.id,
    color: `rgb(${[_randRGBComp(), _randRGBComp(), _randRGBComp()].join(', ')})`,
    position: { x: _randNum(), y: _randNum(), z: 0 }
  };

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