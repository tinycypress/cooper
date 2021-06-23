import { Server } from "socket.io";
import Socket from "./socket";

// Remove players after a few minutes of inactivity?
const players = [];

const tileLength = 15;

const getRandomColor = () => {
  const letters = '0123456789abcdef';
  let color = '0x';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const getRandNumTestingOnly = () => Math.floor((Math.random() * tileLength) + -tileLength);

const playerConnected = socket => {
  const player = {
    id: socket.id,
    color: `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`,
    position: { 
      x: getRandNumTestingOnly(), 
      y: getRandNumTestingOnly(), 
      z: 0 
    }
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