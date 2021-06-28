import { Server } from "socket.io";
import { TIME } from "../../../origin/coop";
import Socket from "./socket";

const tileLength = 15;
const _randNum = () => Math.floor((Math.random() * tileLength) + -tileLength);
const _randRGBComp = () => Math.max(150, Math.abs(_randNum()));

// Remove players after a few minutes of inactivity?
const players = {};

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
  players[socket.id] = player;

  // Inform all users someone connected.
  Socket.conn.emit('player_recognised', player);

  // Summarise the current world state.
  const worldState = {
    current_world_state: 'experiment',

    // Attach the players object, may need pruning/optimising.
    players
  };

  // Give the user who just connected all of the current world state data for rendering.
  socket.emit('world_state_change', worldState);

  // Add a disconnect handler for this player.
  socket.on('disconnect', () => {
    console.log('Player disconnected', socket.id);
    Socket.conn.emit('player_disconnected', socket.id);
  });
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
  Socket.conn.on('player_moved', move => {
    // Player is sending movement data to server that could be sus.
    // Move but be careful with it/validate/sanitise.
    console.log('server ws received player movement data to process.');
    console.log(move);

    // Emit it to all players... see if they pick it up.
  });
}