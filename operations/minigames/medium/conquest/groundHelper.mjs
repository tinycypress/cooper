import Socket from "../../../../api/services/socket/socket.mjs";
import { TIME } from "../../../../origin/coop.mjs";
import Ground from "./ground.mjs";
import Auth from '../../../../api/auth/_auth.mjs';


export default class GroundHelper {

    static tileLength = 15;

    static _randNum() {
        return Math.floor((Math.random() * this.tileLength) + -this.tileLength);
    }

    static _randRGBComp() {
        return Math.max(150, Math.abs(this._randNum()));
    }

    static playerConnected = socket => {
        const player = {
          id: socket.id,
          connected_at: TIME._secs(),
          last_activity: TIME._secs(),
          username: socket.id,
          color: 'red',

          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 }
        };
        
        // Parse username from token if authenticated.
        const token = Auth.decode(socket.handshake.auth.token);
        if (token) player.username = token.username;

        // Start tracking new player.
        Ground.players[socket.id] = player;
      
        // Inform all users someone connected.
        Socket.conn.emit('player_recognised', player);
      
        // Add a disconnect handler for this player.
        socket.on('disconnect', () => {
          Socket.conn.emit('player_disconnected', socket.id);
      
          // Remove the player data.
          delete Ground.players[socket.id];
        });

        // Add an event listener for moving which broadcasts to all other users.
        socket.on('player_moved', GroundHelper.playerMoved);
    }

    static playerMoved(move) {
        Socket.conn.emit('player_moved', move);
    }
}