import STATE from "../../../../core/state";
import { EGG_DATA } from "../../minigame/small/egghunt";
import EMOJIS from "../../../../core/config/emojis.json";

import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import PointsHelper from "../../points/pointsHelper";
import ReactionHelper from "../../../../core/entities/messages/reactionHelper";
import UsersHelper from "../../../../core/entities/users/usersHelper";
import { usedOwnedUsableGuard } from "../../../../core/entities/commands/guards/itemCmdGuards";


// TODO: Make into "ReactionUsableItem" and add callback

export default class AverageEggHandler {

    // TODO: Refactor for all eggs.
    static shouldTriggerSuggest(reaction) {
        return reaction.emoji.name === '💚' && reaction.count === 3;
    }

    // TODO: Eggs need some way of dealing with user's using on self...
    static async onReaction(reaction, user) {
        if (reaction.emoji.name === 'average_egg') {
            try {
                // Allow Cooper to add the suggestion whether he has any or not.
                // If he has them, let him use like anyone else. :D
                // // If popularity meant that it was added, don't warn... he's just adding suggestion reaction.
                // // TODO: Add popularity check to this egg and all other eggs
                // if (!UsersHelper.isCooper(user.id) && this.shouldTriggerSuggest(reaction))
                //     MessagesHelper.selfDestruct(reaction.message, failureText);

                const used = await usedOwnedUsableGuard(user, 'AVERAGE_EGG', 1, reaction.message);
                if (!used) return false;
                
                // Chance of backfiring.
                const backFired = STATE.CHANCE.bool({ likelihood: 33 });
                const author = reaction.message.author;
                const isSelf = user.id === author.id;
                const targetID = backFired ? user.id : author.id;

                // Toxic bomb damage definition.
                const damage = EGG_DATA['AVERAGE_EGG'].points;

                // Initialise dynamic damage info text.
                let damageInfoText = '';

                // Only apply damage when egg hasn't broken on self.
                if (!(backFired && isSelf)) {
                    // Apply the damage to the target's points.
                    const updatedPoints = await PointsHelper.addPointsByID(targetID, damage);

                    // Update feedback string, did cause damage.
                    damageInfoText = `: ${damage} points (${updatedPoints})`;

                    // Remove the egg based on popularity.
                    const popularity = ReactionHelper.countType(reaction.message, '💚');
                    if (popularity < 3 && !UsersHelper.isCooper(user.id)) 
                        MessagesHelper.delayReactionRemove(reaction, 333);

                    // Add Cooper's popularity suggestion.
                    MessagesHelper.delayReact(reaction.message, '💚', 666);
                }

                // Detect self and format text accordingly.
                let target = `<@${author.id}>`;
                if (isSelf) target = 'their self';

                // Create the action/feedback text.
                let actionInfoText = `<@${user.id}> used an average egg on ${target}`;
                if (backFired) actionInfoText = `<@${user.id}> tried to use an average egg on ${target}, but it backfired`;
                if (backFired && isSelf) actionInfoText = `<@${user.id}> tried to use an average egg on ${target}, but it broke.`;

                // Post it.
                const feedbackMsgText = `${actionInfoText}${damageInfoText}.`;
                ChannelsHelper.codeShoutReact(reaction.message, feedbackMsgText, 'ACTIONS', '💚');
                
            } catch(e) {
                console.error(e);
            }
        }


        // On 3 average hearts, allow average egg suggestion.
        if (this.shouldTriggerSuggest(reaction))
            MessagesHelper.delayReact(reaction.message, EMOJIS.AVERAGE_EGG, 333);
    }
   
}