import { EGG_DATA } from '../../../../small/egghunt';

import UsableItemHelper from "../usableItemHelper";

import { EMOJIS } from "../../../../../../origin/config";
import COOP, { STATE, REACTIONS } from "../../../../../../origin/coop";

export default class RareEggHandler {

    static async onReaction(reaction, user) {
        if (reaction.emoji.name === 'rare_egg') {
            try {
                const didUse = await UsableItemHelper.use(user.id, 'RARE_EGG', 1);
                if (!didUse) {
                    const failureText = `${user.username} tried to use a rare egg, but has none...`;
                    COOP.MESSAGES.selfDestruct(reaction.message, failureText, 0, 5000);
                    COOP.MESSAGES.delayReactionRemoveUser(reaction, user.id, 333);
                } else {
                    const backFired = STATE.CHANCE.bool({ likelihood: 25 });
                    const author = reaction.message.author;
                    const targetID = backFired ? user.id : author.id;

                    // Toxic bomb damage definition.
                    const damage = EGG_DATA['RARE_EGG'].points;

                    // Apply the damage to the target's points.
                    const updatedPoints = await COOP.POINTS.addPointsByID(targetID, damage);

                    // Calculate feedback text.
                    const damageInfoText = ` ${damage} points (${updatedPoints})`;
                    let actionInfoText = `${user.username} used a rare egg on ${author.username}`;
                    if (backFired) actionInfoText = `${user.username} tried to use a rare egg on ${author.username}, but it backfired`;
                    const feedbackMsgText = `${actionInfoText}: ${damageInfoText}.`;

                    // Send feedback and emojis.
                    COOP.CHANNELS.codeShoutReact(reaction.message, feedbackMsgText, 'ACTIONS', '💙');

                    // Remove the egg based on popularity.
                    const popularity = REACTIONS.countType(reaction.message, '💙');
                    if (popularity < 3 && !COOP.USERS.isCooper(user.id)) 
                        COOP.MESSAGES.delayReactionRemove(reaction, 333);
                        

                    COOP.MESSAGES.delayReact(reaction.message, '💙', 666);
                }
            } catch(e) {
                console.error(e);
            }
        }

        // On 3 average hearts, allow average egg suggestion.
        if (reaction.emoji.name === '💙' && reaction.count === 3)
            // Add average_egg emoji reaction.
            COOP.MESSAGES.delayReact(reaction.message, EMOJIS.RARE_EGG, 333);
    }
   
}