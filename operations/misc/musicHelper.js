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

            // Return newly created dispatcher/stream controller.
            return this.STREAM_DISPATCHER;
        } catch(e) {
            console.log('Error playing stream:');
            console.error(e);
        }
    }

    static async playNext() {
        const link = this.QUEUE[0];
        const track = ytdl(link, { filter: "audioonly" });

        // Attempt to play.
        this.play(track, link);
        
        // Remove attempt track from queue.
        this.QUEUE.shift();
    }

    // Play the url passed.
    static async play(stream, link) {
        // Connect, may have disconnected.
        await this.connect();

        // Blend the tracks.
        const dispatcher = this.crossfade(stream);

        // Indicate that the stream has started.
        dispatcher.on('start', () => this.CURRENTLY_PLAYING = link);

        // Leave if nothing else is queued?
        dispatcher.on("finish", () => {
            // There's nothing now playing due to finish.
            this.CURRENTLY_PLAYING = null;

            // Play the next track if there is one.
            if (this.QUEUE.length <= 0) this.playNext();
            else this.disconnect();
        });
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
}