import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../core/entities/messages/messagesHelper";
import UsersHelper from "../../../core/entities/users/usersHelper";

export default class MessageSpamHelper {

    static async onMessage(msg) {
        // Only apply to Cooper's messages.
        if (!UsersHelper.isCooperMsg(msg)) return false;

        // Kill Commandojs annoying messages.
        if (msg.content.includes(', Cancelled command.'))
            return MessagesHelper.delayDelete(msg, 5000);

        if (msg.content.includes('Respond with cancel to cancel the command.'))
            return MessagesHelper.delayDelete(msg, 5000);

        if (msg.content.includes('can only be used by the bot owner.'))
            return MessagesHelper.delayDelete(msg, 5000);

        if (msg.content.includes('The command will automatically be cancelled in 30 seconds.'))
            return MessagesHelper.delayDelete(msg, 5000);


            
    }

}
