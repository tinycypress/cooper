import { Server } from "socket.io";
import { TIME } from "../../../origin/coop";
import Socket from "./socket";

const tileLength = 15;
const _randNum = () => Math.floor((Math.random() * tileLength) + -tileLength);
const _randRGBComp = () => Math.max(150, Math.abs(_randNum()));

// Remove players after a few minutes of inactivity?
const players = [];

const playerConnected = socket => {
  const player = {
    id: socket.id,
    position: { x: _randNum(), y: 0, z: _randNum() },
    connected_at: TIME._secs(),
    last_activity: TIME._secs(),
    
    // Struggling to get this to work, Three is pretty strict for some reason. =[... help.
    // color: `rgb(${[_randRGBComp(), _randRGBComp(), _randRGBComp()].join(', ')})`,
    // Placeholder:
    color: 'red'
  };

  // Start tracking new player.
  players.push(player);

  // Inform all users someone connected.
  Socket.conn.emit('player_recognised', player);

  // Summarise the current world state.
  const worldState = {
    current_world_state: 'experiment',

    // Attach the players object, may need pruning/optimising.
    players
  };

  // Give the user who just connected all of the current world state data for rendering.
  console.log(Socket.conn);
  // Socket.conn.ws.broadcast.to(socket.id).emit('current_world_state', worldState);
}

export default function configureWS(server) {
  // Create an instance with reference to socket io server.
  Socket.conn = new Server(server, {
    serveClient: false,
    cors: { origin: '*' }
  });

  // Handle incoming connections, mainly here for debugging.
  Socket.conn.on('connection', playerConnected);

  // TODO:
  // Add an event listener for moving which broadcasts to all other users.
}