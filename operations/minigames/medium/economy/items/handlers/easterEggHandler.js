import { usedOwnedUsableGuard } from '../../itemCmdGuards';
import COOP from '../../../../../../origin/coop';




export default class EasterEggHandler {

    static async use(commandMsg, user) {       
        // Apply multi-guard for usable item, owned, and consumed for this action.
        const used = await usedOwnedUsableGuard(user, 'EASTER_EGG', 1, commandMsg);
        if (!used) return false;

        // Calculate reward.
        const rewardBase = await COOP.ITEMSperBeak('COOP_POINT');
        const reward = parseInt(rewardBase * .25);

        // Add the points to the user.
        COOP.ITEMSadd(user.id, 'COOP_POINT', reward);

        // Add feedback.
        const coopEmoji = COOP.MESSAGES._displayEmojiCode('COOP_POINT');
        const eggEmoji = COOP.MESSAGES._displayEmojiCode('EASTER_EGG');
        const feedbackText = `**${eggEmoji.repeat(2)} ${user.username} used their easter egg!**\n\n` +
            `They gained ${reward}x${coopEmoji} (25% of the average CP per beak (${rewardBase}))!`;

        COOP.CHANNELS.propagate(commandMsg, feedbackText, 'ACTIONS');
    }
   

    // TODO: Simplify this taken from average egg and give easter egg reaction functionality too.

    // static async onReaction(reaction, user) {
    //     if (reaction.emoji.name === 'average_egg') {
    //         try {
    //             // Allow Cooper to add the suggestion whether he has any or not.
    //             // If he has them, let him use like anyone else. :D
    //             // // If popularity meant that it was added, don't warn... he's just adding suggestion reaction.
    //             // // TODO: Add popularity check to this egg and all other eggs
    //             // if (!COOP.USERS.isCooper(user.id) && this.shouldTriggerSuggest(reaction))
    //             //     COOP.MESSAGES.selfDestruct(reaction.message, failureText);

    //             const used = await usedOwnedUsableGuard(user, 'AVERAGE_EGG', 1, reaction.message);
    //             if (!used) return false;
                
    //             // Chance of backfiring.
    //             const backFired = STATE.CHANCE.bool({ likelihood: 33 });
    //             const author = reaction.message.author;
    //             const isSelf = user.id === author.id;
    //             const targetID = backFired ? user.id : author.id;

    //             // Toxic bomb damage definition.
    //             const damage = EGG_DATA['AVERAGE_EGG'].points;

    //             // Initialise dynamic damage info text.
    //             let damageInfoText = '';

    //             // Only apply damage when egg hasn't broken on self.
    //             if (!(backFired && isSelf)) {
    //                 // Apply the damage to the target's points.
    //                 const updatedPoints = await COOP.POINTSaddPointsByID(targetID, damage);

    //                 // Update feedback string, did cause damage.
    //                 damageInfoText = `: ${damage} points (${updatedPoints})`;

    //                 // Remove the egg based on popularity.
    //                 const popularity = ReactionHelper.countType(reaction.message, '💚');
    //                 if (popularity < 3 && !COOP.USERS.isCooper(user.id)) 
    //                     COOP.MESSAGES.delayReactionRemove(reaction, 333);

    //                 // Add Cooper's popularity suggestion.
    //                 COOP.MESSAGES.delayReact(reaction.message, '💚', 666);
    //             }

    //             // Detect self and format text accordingly.
    //             let target = author.username;
    //             if (isSelf) target = 'their self';

    //             // Create the action/feedback text.
    //             let actionInfoText = `${user.username} used an average egg on ${target}`;
    //             if (backFired) actionInfoText = `${user.username} tried to use an average egg on ${target}, but it backfired`;
    //             if (backFired && isSelf) actionInfoText = `${user.username} tried to use an average egg on ${target}, but it broke.`;

    //             // Post it.
    //             const feedbackMsgText = `${actionInfoText}${damageInfoText}.`;
    //             COOP.CHANNELS.codeShoutReact(reaction.message, feedbackMsgText, 'ACTIONS', '💚');
                
    //         } catch(e) {
    //             console.error(e);
    //         }
    //     }


    //     // On 3 average hearts, allow average egg suggestion.
    //     if (this.shouldTriggerSuggest(reaction))
    //         COOP.MESSAGES.delayReact(reaction.message, EMOJIS.AVERAGE_EGG, 333);
    // }

}