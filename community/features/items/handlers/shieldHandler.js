import EMOJIS from '../../../../core/config/emojis.json';
import ChannelsHelper from '../../../../core/entities/channels/channelsHelper';
import MessagesHelper from '../../../../core/entities/messages/messagesHelper';
import BuffsHelper from '../../conquest/buffsHelper';
import TimeHelper from '../../server/timeHelper';
import ItemsHelper from '../itemsHelper';

// Give shield user protected state for a set amount of time.

// Purpose of the file and class?
const protectDurationSecs = 1800;


// Give shield a total value and damage it over time like health?
// Reserve feature to health for now, create this as a buff instead of "total shield".

// What does the shield do: Start typing squidling.
export default class ShieldHandler {

    // Intercept item usages via emoji reactions.
    static async onReaction(reaction, user) {     
        // Confirm reaction is shield before processing.  
        if (!EMOJIS.SHIELD === reaction.emoji.name) return false;

        MessagesHelper.selfDestruct(reaction.message, 'You wanna use a shield, ey?');

        // TODO: Support using a shield on yourself/someone else.
    }

    // Allow people to use the items without having to react to a message.
    static async use(msg) {
        // Attempt to use the shield item
        const didUseShield = await ItemsHelper.use(msg.author.id, 'SHIELD', 1);

        // Respond to usage result.
        if (didUseShield) {
            let currentProtectionMins = protectDurationSecs / 60;

            // TODO: Check in toxic eggs/bombs for invicibility.
            // BuffsHelper.has('INVINCIBLITY', user.id);

            if (BuffsHelper.has('INVINCIBILITY', msg.author.id)) {
                // If they already have invincibility, top it up?
                const updatedExpiry = BuffsHelper.topup('INVINCIBILITY', msg.author.id, protectDurationSecs);
                const updatedProtectionSecs = updatedExpiry - TimeHelper._secs();

                // Update the feedback displayy value.
                currentProtectionMins = updatedProtectionSecs;

            } else {
                // Protect them by saving the buff data in state for this msg.author.
                await BuffsHelper.add('INVINCIBLITY', msg.author.id);
            }

            // Provide feedback which also stacks based on existing protection "credit".
            const fmtProtSecs = TimeHelper.secsLongFmt(currentProtectionMins);
            const feedbackText = `${msg.author.username} used shield and protected themself for ${fmtProtSecs} minutes!`;
            ChannelsHelper.propagate(msg, feedbackText, 'ACTIONS');
            
        } else {
            const unableMsg = await MessagesHelper.selfDestruct(msg, 'Unable to use SHIELD, you own none. :/', 5000);

            MessagesHelper.delayReact(unableMsg, RAW_EMOJIS.SHIELD, 1333);
        }
    }
   
}