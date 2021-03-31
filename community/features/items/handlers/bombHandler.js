import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import BuffsHelper from "../../conquest/buffsHelper";
import PointsHelper from "../../points/pointsHelper";
import ItemsHelper from "../itemsHelper";

export default class BombHandler {

    static async onReaction(reaction, user) {
        const msg = reaction.message;
        const target = msg.author;
        
        // TODO: Pass the bomb needs to be implemented somehow from here.
        
        if (reaction.emoji.name === '💣') {
            try {
                const didUse = await ItemsHelper.use(user.id, 'BOMB', 1);
                if (!didUse) {
                    MessagesHelper.selfDestruct(msg, `${user.username} lacks a bomb to use on ${target.username}`);
                    return await reaction.users.remove(user.id);
                } else {
                    // Check and prevent bombing target with invincibility buff.
                    if (BuffsHelper.has('INVINCIBILITY', target.id)) {
                        // TODO: Add some kind of animation via message edit. :D
                        // TODO: Count invincibility blocks into stats.
                        const shieldEmoji = MessagesHelper._displayEmojiCode('SHIELD');
                        return MessagesHelper.selfDestruct(msg, `${shieldEmoji.repeat(2)} ${target.username} was protected from ${user.username}'s bomb by invincibility buff! `)
                    }

                    // Allow five seconds for people to stack bombs.
                    setTimeout(async () => {
                        // Let bombs stack and amplify the damage.
                        const damage = -4 * reaction.count;
    
                        // Apply the damage to the target's points.
                        const updatedPoints = await PointsHelper.addPointsByID(target.id, damage);
    
                        // Add visuals animation
                        MessagesHelper.delayReactionRemove(reaction, 333);
                        MessagesHelper.delayReact(msg, '💥', 666);
                        
                        // Handle text feedback for stack effect.
                        let doubledInfo = '';
                        if (reaction.count > 1) doubledInfo = `(x${reaction.count})`;

                        const subjectsInvolved = `${user.username} bombed ${target.username}`;
                        const changesOccurred = `${damage}${doubledInfo} points (${updatedPoints}).`;
                        const feedbackText = `${subjectsInvolved}: ${changesOccurred}`;

                        ChannelsHelper.propagate(msg, feedbackText, 'ACTIONS');
                    }, 5000);
                }
            } catch(e) {
                console.error(e);
            }
        }   
    }
   
}