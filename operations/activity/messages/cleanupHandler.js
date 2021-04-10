import COOP from "../../../origin/coop";

export default class CleanupHandler {

    static async onReaction(msg) {
        // if (msg.channel.type !== "dm") return false;
        // if (COOP.USERS.isCooperMsg(msg)) return false;
        // if (msg.command !== null) return false;

        // console.log('TRYING TO CLEAN UP COOPER MESSAGE!!!!');

        // Check if the reactor is leader/commander
        // If so, delete the message, trash icon?

        // const annotatedMsgText = `DM message from ${msg.author.username}: ${msg.content}`;
        // COOP.CHANNELS_postToChannelCode('LEADERS', annotatedMsgText);

        // setTimeout(async () => {
        //     const replyableMsg = await COOP.CHANNELS_postToChannelCode('COOPERTESTS', annotatedMsgText);
        //     replyableMsg.channel.awaitMessages(
        //         () => true,
        //         { max: 1, time: 30000, errors: ['time'] }
        //     )
        //     .then(responses => {
        //         responses.map(resp => {
        //             COOP.USERS._dm(msg.author.id, resp.content);
        //         });
        //     })
        //     .catch(console.error);

        // }, 1333);

    }

}