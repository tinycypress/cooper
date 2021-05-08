import { CHANNELS, STATE } from "../../origin/coop";
import ytdl from 'ytdl-core';

export default class MusicHelper {

    static STREAM_DISPATCHER = null;

    static CURRENTLY_PLAYING = null;
    static QUEUE = [];

    static async connect() {
        // Join the stream channel in order to be the music bot.
        const stream = CHANNELS._getCode('STREAM_ACTUAL');
        STATE.VOICE_CONNECTION = await stream.join();

        // Is the sub-property "voice" necessary? :think:
        await STATE.VOICE_CONNECTION.voice.setSelfDeaf(true);

        return STATE.VOICE_CONNECTION;
    }

    static disconnect() {
        if (STATE.VOICE_CONNECTION && typeof STATE.VOICE_CONNECTION === 'function')
            STATE.VOICE_CONNECTION.disconnect();

        // This definitely works but above is clearer/faster/UNTESTED.
        CHANNELS._getCode('STREAM_ACTUAL').join().then(conn => conn.disconnect());
    }

    
    static rampVolume(targetVol) {
        // Gradually increase/decrease the volume.
        let currentVolume = 0;
        const rampInterval = setInterval(() => {                           
            // Handle the ramp directions differently.
            if (targetVol > 0) {
                currentVolume += .1
                if (currentVolume >= targetVol) 
                    clearInterval(rampInterval);
            } else {
                currentVolume -= .1;
                if (currentVolume <= targetVol) 
                    clearInterval(rampInterval);
            }

            // Apply the decreased % volume level.
            this.STREAM_DISPATCHER.setVolume(currentVolume);
        }, 500);
    }

    static crossfade(stream) {
        try {
            // Gradually decrease the volume.
            this.rampVolume(0);
    
            // Play the stream.
            this.STREAM_DISPATCHER = STATE.VOICE_CONNECTION.play(stream, { volume: 0 });
    
            // Gradually increase the volume.
            this.rampVolume(0.25);
        } catch(e) {
            console.log('Error playing stream:');
            console.log(e.message, e.reason);
            console.error(e);
        }
    }

    static async playNext() {
        const link = this.QUEUE[0];
        const track = this.load(link);

        // Remove attempt track from queue.
        this.CURRENTLY_PLAYING = this.QUEUE.shift();

        // Attempt to play.
        this.play(track);
    }

    // Play the url passed.
    static async play(stream) {
        // Connect, may have disconnected.
        await this.connect();

        // Blend the tracks.
        this.crossfade(stream);

        // Leave if nothing else is queued?
        this.STREAM_DISPATCHER.on("finish", () => {
            if (this.QUEUE.length > 0) {              
                // Play the next track.
                this.playNext();
            } else 
                // Disconnect on finish.
                this.disconnect();
        });

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
        return ytdl(url, { filter: "audioonly" });
    }

    static queue(link) {
        // Add the track to the music queue.
        this.QUEUE.push(link);
    }

    // static async unqueue() {}

}