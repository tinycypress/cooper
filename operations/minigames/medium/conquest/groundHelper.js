import Socket from "../../../../api/services/socket/socket";
import { TIME } from "../../../../origin/coop";
import Ground from "./ground";


export default class GroundHelper {

    static async all() {
        return {};
    }

    static async get(tileID) {
        return {};
    }

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
          position: { x: this._randNum(), y: 0, z: this._randNum() },
          connected_at: TIME._secs(),
          last_activity: TIME._secs(),
          
          // Struggling to get this to work, Three is pretty strict for some reason. =[... help.
          // color: `rgb(${[_randRGBComp(), _randRGBComp(), _randRGBComp()].join(', ')})`,
          // Placeholder:
          color: 'red'
        };

        // Start tracking new player.
        Ground.players[socket.id] = player;
      
        // Inform all users someone connected.
        Socket.conn.emit('player_recognised', player);
      
        // Add a disconnect handler for this player.
        socket.on('disconnect', () => {
          console.log('Player disconnected', socket.id);
          Socket.conn.emit('player_disconnected', socket.id);
      
          // Remove the player data.
          delete Ground.players[socket.id];
        });
    }

    static playerMoved(move) {
        // Player is sending movement data to server that could be sus.
        // Move but be careful with it/validate/sanitise.
        console.log('server ws received player movement data to process.');
        console.log(move);
   
        // Emit it to all players... see if they pick it up.
        Socket.conn.emit('player_moved', move);
    }
}