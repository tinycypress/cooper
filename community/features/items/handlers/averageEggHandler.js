import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import STATE from "../../../../core/state";
import { EGG_DATA } from "../../minigame/small/egghunt";
import PointsHelper from "../../points/pointsHelper";
import ItemsHelper from "../itemsHelper";
import EMOJIS from "../../../../core/config/emojis.json";
import ReactionHelper from "../../../../core/entities/messages/reactionHelper";
import UsersHelper from "../../../../core/entities/users/usersHelper";


// TODO: Make into "ReactionUsableItem" and add callback

export default class AverageEggHandler {

    // TODO: Eggs need some way of dealing with user's using on self...
    static async onReaction(reaction, user) {
        if (reaction.emoji.name === 'average_egg') {
            try {
                const didUse = await ItemsHelper.use(user.id, 'AVERAGE_EGG', 1);
                if (!didUse) {
                    const failureText = `${user.username} tried to use an average egg, but has none. Lul.`;
                    MessagesHelper.selfDestruct(reaction.message, failureText);

                } else {
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
                    let target = author.username;
                    if (isSelf) target = 'their self';

                    // Create the action/feedback text.
                    let actionInfoText = `${user.username} used an average egg on ${target}`;
                    if (backFired) actionInfoText = `${user.username} tried to use an average egg on ${target}, but it backfired`;
                    if (backFired && isSelf) actionInfoText = `${user.username} tried to use an average egg on ${target}, but it broke.`;

                    // Post it.
                    const feedbackMsgText = `${actionInfoText}${damageInfoText}.`;
                    ChannelsHelper.codeShoutReact(reaction.message, feedbackMsgText, 'ACTIONS', '💚');
                }
            } catch(e) {
                console.error(e);
            }
        }


        // On 3 average hearts, allow average egg suggestion.
        if (reaction.emoji.name === '💚' && reaction.count === 3)
            // Add average_egg emoji reaction.
            MessagesHelper.delayReact(reaction.message, EMOJIS.AVERAGE_EGG, 333);
    }
   
}