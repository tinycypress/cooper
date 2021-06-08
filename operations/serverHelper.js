import COOP from '../origin/coop';
import { SERVERS } from '../origin/config';

export default class ServerHelper {

    static _coop() { return this.getByCode(COOP.STATE.CLIENT, 'PROD'); }

    static getByID(client, id) { return client.guilds.cache.get(id); }

    static getByCode(client, code) { return this.getByID(client, SERVERS[code].id); }

    static _count(numBots = 1) { return this._coop().memberCount - numBots || 0; }
}