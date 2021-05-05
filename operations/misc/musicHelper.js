import { CHANNELS, STATE } from "../../origin/coop";
import ytdl from 'discord-ytdl-core';

export default class MusicHelper {

    static STREAM_DISPATCHER = null;

    static async connect() {
        // Join the stream channel in order to be the music bot.
        const stream = CHANNELS._getCode('STREAM_ACTUAL');
        STATE.VOICE_CONNECTION = await stream.join();

        // Is the sub-property "voice" necessary? :think:
        await STATE.VOICE_CONNECTION.voice.setSelfDeaf(true);

        return STATE.VOICE_CONNECTION;
    }

    // TODO: Play the url passed.
    static async play(stream) {
        // Connect, may have disconnected.
        await this.connect();

        // Play the stream.
        this.STREAM_DISPATCHER = STATE.VOICE_CONNECTION.play(stream, { 
            type: "opus",
            volume: 0
        });

        // Gradually increase the volume.
        let volume = 0;
        const i = setInterval(() => {               
            // Stop if all volume increases have been accomplished.
            if (volume >= .30) clearInterval(i);

            // Count the level as applied.
            volume += .1;

            // Apply the increased % volume level.
            this.STREAM_DISPATCHER.setVolume(0.25);
        }, 150);

        // Leave if nothing else is queued?
        this.STREAM_DISPATCHER.on("finish", () => STATE.VOICE_CONNECTION.leave());

        // Always remember to handle errors appropriately!
        this.STREAM_DISPATCHER.on('error', console.error);
    }

    static async pause() {
        this.STREAM_DISPATCHER.pause();
    }

    static async resume() {
        this.STREAM_DISPATCHER.resume();
    }

    // Set the volume of the stream.
    static setVolume(vol) {
        return this.STREAM_DISPATCHER.setVolume(vol);
    }

    static load(url) {
        // Create a non mp4 write stream, needs to be:
        return ytdl(url, {
            filter: "audioonly",
            opusEncoded: true,
            encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
        });
    }

    // static async queue() {}
    // static async unqueue() {}

}