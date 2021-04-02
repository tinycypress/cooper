import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import PointsHelper from "../../points/pointsHelper";
import ItemsHelper from "../itemsHelper";
import UsableItemHelper from "../usableItemHelper";

export default class IEDHandler {

    // Arm the IED on a message.
    static async arm() {

    }

    static async onReaction(reaction, user) {       
        // TODO: Change the emoji, wrong!
        if (reaction.emoji.name === '💣') {
            try {
                // TODO: Change the itemcode, wrong!
                const didUse = await UsableItemHelper.use(user.id, 'BOMB', 1);
                if (!didUse) {
                    // TODO: Warn that the user is missing the item
                    return await reaction.users.remove(user.id);
                } else {
                    // const messageAuthor = reaction.message.author;

                    // // Allow five seconds for people to stack bombs.
                    // setTimeout(async () => {
                    //     // Let bombs stack and amplify the damage.
                    //     const damage = -4 * reaction.count;
    
                    //     // Apply the damage to the target's points.
                    //     const updatedPoints = await PointsHelper.addPointsByID(messageAuthor.id, damage);
    
                    //     // Add visuals animation
                    //     MessagesHelper.delayReactionRemove(reaction, 333);
                    //     MessagesHelper.delayReact(reaction.message, '💥', 666);
    
                    //     let doubledInfo = '';
                    //     if (reaction.count > 1) doubledInfo = `(x${reaction.count})`;
                    //     const subjectsInvolved = `${user.username} bombed ${messageAuthor.username}`;
                    //     const changesOccurred = `${damage}${doubledInfo} points (${updatedPoints}).`;
                    //     await ChannelsHelper._postToFeed(`${subjectsInvolved}: ${changesOccurred}`);
                    // }, 5000);
                }
            } catch(e) {
                console.error(e);
            }
        }   
    }
   
}