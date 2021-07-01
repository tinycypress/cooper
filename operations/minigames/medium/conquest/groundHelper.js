import Socket from "../../../../api/services/socket/socket";
import { TIME } from "../../../../origin/coop";
import Ground from "./ground";
import Auth from '../../../../api/auth/_auth';



let guestNum = 0;

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
          rotation: { x: this._randNum(), y: 0, z: this._randNum() },
          connected_at: TIME._secs(),
          last_activity: TIME._secs(),
          
          // Struggling to get this to work, Three is pretty strict for some reason. =[... help.
          // color: `rgb(${[_randRGBComp(), _randRGBComp(), _randRGBComp()].join(', ')})`,
          // Placeholder:
          color: 'red',

          username: 'guest' + guestNum++
        };
        
        const token = socket.handshake.auth.token;
        console.log(Auth.decode(token));

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
        // TODO: Validate/limit
        // ...

        // Broadcast
        Socket.conn.emit('player_moved', move);
    }
}