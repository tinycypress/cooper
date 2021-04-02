import EMOJIS from '../../../../core/config/emojis.json';
import MessagesHelper from '../../../../core/entities/messages/messagesHelper';
import UsersHelper from '../../../../core/entities/users/usersHelper';
import BuffsHelper, { BUFF_TYPES } from '../../conquest/buffsHelper';
import TimeHelper from '../../server/timeHelper';
import ItemsHelper from '../itemsHelper';



// What does the shield do: Start typing squidling.
export default class RPGHandler {

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
        const didUse = await didUseGuard(user, 'RPG', msg);
        
        // Respond to usage result.
        if (didUse) {
            // Reference the shielding target.
            const target = msg.author;
            const targetName = target.id === user.id ? 'their self' : target.username;

            // Apply the shield buff to the target.
            const protectionExpiry = this.runEffect(target.id);

            // TODO: Add an effect here for RPG
            const successText = `${user.username} used an RPG on ${targetName}, blasting them and potentially starting a chain reaction!`;
            MessagesHelper.selfDestruct(reaction.message, successText, 0, 15000);
        }
    }


    // Allow people to use the items without having to react to a message.
    static async use(msg) {
        // Attempt to use the shield item
        const didUse = await didUseGuard(msg.author, 'RPG', msg);

        // Respond to usage result.
        if (didUse) {
            const protectionExpiry = this.runEffect(msg.author.id);

            // Provide feedback.
            const shieldEmoji = MessagesHelper._displayEmojiCode('RPG');
            const successText = `${shieldEmoji.repeat(2)} ${msg.author.username} used an RPG, oOoOoOo...`;
            return MessagesHelper.selfDestruct(msg, successText, 0, 5000);
        }
    }


    static runEffect(targetID) {
        console.log('Running RPG effect.');


        // let currentProtectionMins = BUFF_TYPES.INVINCIBILITY.duration / 60;

        // Check if topping up or adding initial protection.
        if (BuffsHelper.has('INVINCIBILITY', targetID)) {
            // // If they already have invincibility, top it up?
            // const updatedExpiry = BuffsHelper.topup('INVINCIBILITY', targetID, BUFF_TYPES.INVINCIBILITY.duration);
            // const updatedProtectionSecs = updatedExpiry - TimeHelper._secs();

            // // Update the feedback displayy value.
            // currentProtectionMins = updatedProtectionSecs;
            
        } else {
            // // Protect them by saving the buff data in state for this msg.author.
            // BuffsHelper.add('INVINCIBILITY', targetID, currentProtectionMins);
        }

        // Return updated/calculated protection time.
        // return currentProtectionMins;
    }
   
}