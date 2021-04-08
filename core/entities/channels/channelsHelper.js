import CHANNELS from '../../config/channels.json';

import STATE from '../../state';
import ServerHelper from '../server/serverHelper';
import MessagesHelper from '../messages/messagesHelper';
import MessageNotifications from '../../../community/events/message/messageNotifications';


export const silentOpts = { allowedMentions: { users: [], roles: [] }};

export default class ChannelsHelper {

    // TODO: Need to reuse this a lot! Ping/link without pinging! <3 <3 
    static _send(code, msg, opts = silentOpts) {
        const coop = ServerHelper._coop();
        const chan = this.getByCode(coop, code);
        return chan.send(msg, opts);
    }
    

    static async silentPropagate(msgRef, text, recordChan, selfDestruct = true) {
        // If channel isn't identical to record channel, post there too.
        if (!this.checkIsByCode(msgRef.channel.id, recordChan) && selfDestruct)
            MessagesHelper.silentSelfDestruct(msgRef, text, 0, 15000);

        // Post to the record channel and return the outcome.
        return this._send(recordChan, text);
    }


    static getByID(guild, id) {
        return guild.channels.cache.get(id);
    }

    static _get(id) {
        return this.getByID(ServerHelper._coop(), id);
    }

    static _getCode(code) {
        return this.getByCode(ServerHelper._coop(), code);
    }

    static getByCode(guild, code) {
        return this.getByID(guild, CHANNELS[code].id);
    }

    static filter(guild, filter) {
        return guild.channels.cache.filter(filter);
    }

    static filterByCodes(guild, codes) {
        const ids = codes.map(code => CHANNELS[code].id);
        const filter = channel => ids.includes(channel.id);
        return ChannelsHelper.filter(guild, filter);
    }

    static _postToFeed(message, delay = 666) {
        const prodServer = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        const feedChannel = this.getByCode(prodServer, 'FEED');
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const msg = await feedChannel.send(message);
                resolve(msg);
            }, delay);
            setTimeout(() => reject(false), delay * 2);
        });
    }

    static codeSay(channelCode, messageText, delay = 666) {
        return this._postToChannelCode(channelCode, messageText, delay);
    }

    static codeSayReact(channelCode, messageText, emoji, delay = 666) {
        return this.codeSay(channelCode, messageText, emoji, delay)
            .then(msg => {
                if (msg) MessagesHelper.delayReact(msg, emoji, delay * 1.5);
            });
    }

    static codeShout(msgRef, text, recordChan, selfDestruct = true) {
        if (!this.checkIsByCode(msgRef.channel.id, recordChan)) {
            msgRef.say(text).then(msg => {
                if (selfDestruct) MessagesHelper.delayDelete(msg, 15000);
            });
        }
        return this._postToChannelCode(recordChan, text, 666);
    }

    static codeShoutReact(msgRef, text, recordChan, emoji, selfDestruct = true) {
        return this.codeShout(msgRef, text, recordChan, selfDestruct)
            .then(msg => {
                if (msg) MessagesHelper.delayReact(emoji)
            });
    }

    // This function may be a good example/starting point for a lib 
    // for handling request timeouts and reject enforcement...?
    static _postToChannelCode(name, message, delay = 666) {
        const prodServer = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        const feedChannel = this.getByCode(prodServer, name);

        
        return new Promise((resolve, reject) => {
            let request = null;
            setTimeout(() => {
                if (feedChannel && typeof feedChannel.send === 'function') {
                    request = feedChannel.send(message);
                    
                    resolve(request);
                } else {
                    console.log(name + 'channel send failure');
                }
            }, delay);

            // Timeout.
            setTimeout(() => {
                // Is reject still triggered even if resolve has been?
                if (!request) reject('Timeout');
            }, delay * 2);
        });
    }

    static _codes(codes, message, opts) {
        const guild = ServerHelper._coop();
        return ChannelsHelper
            .filterByCodes(guild, codes)
            .map(channel => channel.send(message, opts));
    }

    static _randomText() {
        const server = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        return this.fetchRandomTextChannel(server);
    }

    static _randomOnlyActive() {
        // Try to select a random active text channel.
        return MessageNotifications.getActiveChannels();
    }




    // Implement as part of community velocity reform.
    static _randomSomewhatActive() {
        // Only run this half the time, so we don't only drop in active channels.
        if (STATE.CHANCE.bool({ likelihood: 50 }))
            // Try to select a random active text channel.
            return MessageNotifications.getActiveChannels();
        else 
            // Default to basic random channel.
            return this._randomText();
    }


    static async propagate(msgRef, text, recordChan, selfDestruct = true) {
        // If channel isn't identical to record channel, post there too.
        if (!this.checkIsByCode(msgRef.channel.id, recordChan) && selfDestruct)
            MessagesHelper.selfDestruct(msgRef, text, 0, 15000);

        // Post to the record channel and return the outcome.
        return this._send(recordChan, text);
    }

    static async _delete(id) {
        const guild = ServerHelper._coop();
        const channel = guild.channels.cache.get(id);
        return channel.delete();
    }

    static async _create(name, options) {
        return ServerHelper._coop().channels.create(name, options);
    }

    static _all = () => ServerHelper._coop().channels.cache || [];

    static sendByCodes(guild, codes, message, opts = {}) {
        return ChannelsHelper
            .filterByCodes(guild, codes)
            .map(channel => channel.send(message, opts));
    }



    static fetchRandomTextChannel(guild) {       
        let result = null;

        // TODO: Refactor into drop table, where it can be reused.

        // List of channels to not post to, maybe should reuse somewhere.
        const filteredChannels = ['ENTRY', 'INTRO', 'ROLES', 'LEADERS', 'COOPERTESTS'];

        // Prevent egg and crate drops in unverified channels.
        const filteredKeys = Object.keys(CHANNELS)
            .filter(key => !filteredChannels.includes(key));

        const channelKey = STATE.CHANCE.pickone(filteredKeys);
        const channelID = CHANNELS[channelKey].id;
        const channel = guild.channels.cache.get(channelID);
        
        // Filter invalid/deleted channels out, but notify of existence.
        if (channel) result = channel;
        else {
            // Added to debug.
            console.log('Could not find channel', channel, channelID, channelKey);
        }

        return result;
    }



    static checkIsByCode(id, code) {
        const channel = CHANNELS[code];

        let result = false;
        if (channel && channel.id === id) result = true;
        return result;
    }


}