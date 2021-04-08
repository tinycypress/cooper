import EMOJIS from '../../../../core/config/emojis.json';
import MessagesHelper from '../../../../core/entities/messages/messagesHelper';
import UsersHelper from '../../../../core/entities/users/usersHelper';
import BuffsHelper, { BUFF_TYPES } from '../../conquest/buffsHelper';
import TimeHelper from '../../server/timeHelper';


import { usedOwnedUsableGuard } from '../../../../core/entities/commands/guards/itemCmdGuards';

// Give shield user protected state for a set amount of time.

// Purpose of the file and class?


// Give shield a total value and damage it over time like health?
// Reserve feature to health for now, create this as a buff instead of "total shield".

const shieldEmojiDisplay = MessagesHelper._displayEmojiCode('SHIELD');

// What does the shield do: Start typing squidling.
export default class ShieldHandler {

    // Intercept item usages via emoji reactions.
    static async onReaction(reaction, user) {     
        // Confirm reaction is shield before processing.  
        if (EMOJIS.SHIELD !== reaction.emoji.name) return false;

        // Prevent Cooper from having an effect.
        if (UsersHelper.isCooper(user.id)) return false;

        // Reference for shorter code lines.
        const msg = reaction.message;

        // TODO: Add emoji here, Can add another emoji reaction suitable param(?) to pass , ':shield:'
        // Attempt to use the shield item
        const used = await usedOwnedUsableGuard(user, 'SHIELD', 1, msg);
        if (!used) return false;


        // Reference the shielding target.
        const target = reaction.message.author;
        
        // Apply the shield buff to the target.
        const protectionExpiry = this.runEffect(target.id);
        
        // Format and send the feedback text for shield effect.
        const targetName = target.id === user.id ? 'their self' : target.username;
        const successText = `${user.username} used a ${shieldEmojiDisplay} SHIELD on ${targetName}, extending their protection to ${protectionExpiry} 30 mins.`;
        MessagesHelper.selfDestruct(reaction.message, successText, 0, 15000);
    }


    // Allow people to use the items without having to react to a message.
    // TODO: Will need to pass target?
    static async use(msg) {
        // Attempt to use the shield item
        const used = await usedOwnedUsableGuard(msg.author, 'SHIELD', 1, msg);
        if (!used) return false;

        // Respond to usage result.
        const protectionExpiry = this.runEffect(msg.author.id);

        // Provide feedback.
        const successText = `${shieldEmojiDisplay.repeat(2)} ${msg.author.username} used a SHIELD, extending their protection to ${protectionExpiry} mins.`;
        return MessagesHelper.selfDestruct(msg, successText, 5000);
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

}