import EMOJIS from '../../../../core/config/emojis.json';
import ChannelsHelper from '../../../../core/entities/channels/channelsHelper';
import MessagesHelper from '../../../../core/entities/messages/messagesHelper';
import UsersHelper from '../../../../core/entities/users/usersHelper';
import BuffsHelper, { BUFF_TYPES } from '../../conquest/buffsHelper';
import TimeHelper from '../../server/timeHelper';
import ItemsHelper from '../itemsHelper';

// Give shield user protected state for a set amount of time.

// Purpose of the file and class?


// Give shield a total value and damage it over time like health?
// Reserve feature to health for now, create this as a buff instead of "total shield".

// What does the shield do: Start typing squidling.
export default class ShieldHandler {

    // Intercept item usages via emoji reactions.
    static async onReaction(reaction, user) {     
        // Confirm reaction is shield before processing.  
        if (EMOJIS.SHIELD !== reaction.emoji.name) return false;

        // Prevent Cooper from having an effect.
        if (UsersHelper.isCooper(user.id)) return false;

        // Reference the shielding target.
        const target = reaction.message.author;
        const targetName = target.id === user.id ? 'their self' : target.username;

        // Attempt to use the shield item
        const didUseShield = await ItemsHelper.use(user.id, 'SHIELD', 1);

        // Respond to usage result.
        if (didUseShield) {
            // Apply the shield buff to the target.
            const protectionExpiry = this.runEffect(target.id);

            const successText = `${user.username} used a SHIELD on ${targetName}, extending their protection to ${protectionExpiry} 30 mins.`;
            MessagesHelper.selfDestruct(reaction.message, successText, 0, 15000);
        }
        
        // Inform user of shield usage failure.
        else
            return this.insufficientError(reaction.message, 'SHIELD', user.username, RAW_EMOJIS.SHIELD);
    }


    // Allow people to use the items without having to react to a message.
    static async use(msg) {
        // Attempt to use the shield item
        const didUseShield = await ItemsHelper.use(msg.author.id, 'SHIELD', 1);

        // Respond to usage result.
        if (didUseShield) {
            const protectionExpiry = this.runEffect(msg.author.id);

            // Provide feedback.
            const successText = `${msg.author.username} used a SHIELD, extending their protection to ${protectionExpiry} mins.`;
            return MessagesHelper.selfDestruct(msg, successText, 5000);
        }
        
        else
            // Inform user of shield usage failure.
            return this.insufficientError(msg, 'SHIELD', msg.author.username, RAW_EMOJIS.SHIELD);
    }


    static runEffect(targetID) {
        let currentProtectionMins = BUFF_TYPES.INVINCIBILITY.duration / 60;

        // Check if topping up or adding initial protection.
        if (BuffsHelper.has('INVINCIBILITY', targetID)) {
            // If they already have invincibility, top it up?
            const updatedExpiry = BuffsHelper.topup('INVINCIBILITY', targetID, BUFF_TYPES.INVINCIBILITY.duration);
            const updatedProtectionSecs = updatedExpiry - TimeHelper._secs();

            // Update the feedback displayy value.
            currentProtectionMins = updatedProtectionSecs;

        } else {
            // Protect them by saving the buff data in state for this msg.author.
            BuffsHelper.add('INVINCIBILITY', targetID, currentProtectionMins);
        }

        // Return updated/calculated protection time.
        return currentProtectionMins;
    }

    // TODO: Refactor this into general item code.
    static async insufficientError(msgRef, itemCode, username, reactEmoji = null) {
        const errorMsg = await MessagesHelper.selfDestruct(msgRef, `${username} you're unable to use ${itemCode}, you own none. :/`, 3000);

        if (reactEmoji)
            MessagesHelper.delayReact(errorMsg, reactEmoji, 1333);
    }
   
}