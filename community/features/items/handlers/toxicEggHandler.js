import EMOJIS from "../../../../core/config/emojis.json";

import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import ReactionHelper from "../../../../core/entities/messages/reactionHelper";
import PointsHelper from "../../points/pointsHelper";
import ItemsHelper from "../itemsHelper";

import STATE from "../../../../core/state";
import BuffsHelper from "../../conquest/buffsHelper";


export default class ToxicEggHandler {

    static async onReaction(reaction, user) {
        const msg = reaction.message;

        if (reaction.emoji.name === 'toxic_egg') {
            try {
                const didUse = await ItemsHelper.use(user.id, 'TOXIC_EGG', 1);
                if (!didUse) {
                    const unableText = `${user.username} tried to use a toxic egg, but has none.`;
                    MessagesHelper.selfDestruct(msg, unableText, 5000);
                    return await reaction.users.remove(user.id);
                } else {
                    const backFired = STATE.CHANCE.bool({ likelihood: 25 });
                    const author = msg.author;
                    const targetID = backFired ? user.id : author.id;

                    // Base action text.
                    let actionInfoText = `${user.username} used a toxic egg on ${author.username}`;
                    

                    // Check if target has invincibility buff.
                    if (BuffsHelper.has('INVINCIBILITY', targetID)) {

                        // TODO: Count invincibility blocks into stats.
                        const shieldEmoji = MessagesHelper._displayEmojiCode('SHIELD');
                        return MessagesHelper.selfDestruct(msg, `${shieldEmoji.repeat(2)} ${auth.username} was protected from ${user.username}'s toxic egg by invincibility buff! `)
                    }



                    
                    // Toxic bomb damage definition.
                    const damage = -3


                    // Apply the damage to the target's points.
                    const updatedPoints = await PointsHelper.addPointsByID(targetID, damage);

                    const popularity = ReactionHelper.countType(msg, '☢️');
                    if (popularity < 3) MessagesHelper.delayReactionRemove(reaction, 333);


                    // Add visuals animation
                    MessagesHelper.delayReact(msg, '☢️', 666);

                    const damageInfoText = ` ${damage} points (${updatedPoints})`;
                    
                    if (backFired) actionInfoText = `${user.username} tried to use a toxic egg on ${author.username}, but it backfired`;

                    const feedbackMsgText = `${actionInfoText}: ${damageInfoText}.`;

                    if (!ChannelsHelper.checkIsByCode(msg.channel.id, 'ACTIONS')) {
                        const feedbackMsg = await MessagesHelper.selfDestruct(msg, feedbackMsgText, 5000);
                        MessagesHelper.delayReact(feedbackMsg, '☢️', 1333);
                    }
                    await ChannelsHelper._postToChannelCode('ACTIONS', feedbackMsgText);
                }
            } catch(e) {
                console.error(e);
            }
        }

        // On 3 average hearts, allow average egg suggestion.
        if (reaction.emoji.name === '☢️' && reaction.count === 3)
            // Add legendary_egg emoji reaction.
            MessagesHelper.delayReact(reaction.message, EMOJIS.TOXIC_EGG, 333);
        
    }
   
}