import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import UsersHelper from "../../../../core/entities/users/usersHelper";
import PointsHelper from "../../points/pointsHelper";
import ItemsHelper from "../itemsHelper";

export default class DiamondHandler {

    static async onReaction(reaction, user) {       
        if (reaction.emoji.name === 'diamond') {
            try {
                const didUse = await ItemsHelper.use(user.id, 'DIAMOND', 1);
                if (!didUse) {
                    // Warn that the user is missing the item
                    MessagesHelper.selfDestruct(reaction.message, `${user.username} lacks 1xDIAMOND...`, 0, 5000);
                    return await reaction.users.remove(user.id);
                } else {
                    const messageAuthor = reaction.message.author;

                    // Allow five seconds for people to stack bombs.
                    setTimeout(async () => {
                        const reward = 10 * reaction.count;
                        const updatedPoints = await PointsHelper.addPointsByID(messageAuthor.id, reward);
    
                        // Add visuals animation
                        MessagesHelper.delayReactionRemove(reaction, 333);
                        MessagesHelper.delayReact(reaction.message, '✨', 666);
                        
                        // Add feedback and action record.
                        let doubledInfo = '';
                        if (reaction.count > 1) doubledInfo = `(x${reaction.count})`;
                        const subjectsInvolved = `${user.username} used a diamond on ${messageAuthor.username}'s message.`;
                        const changesOccurred = `+${reward}${doubledInfo} points (${updatedPoints}).`;
                        ChannelsHelper.propagate(reaction.message, `${subjectsInvolved}: ${changesOccurred}`, 'ACTIONS');

                        // Send a link to the user DM.
                        const msgLink = MessagesHelper.link(reaction.message);
                        const reminderText = `**You used a diamond on this message:** \n\n` + msgLink;
                        UsersHelper._dm(user.id, reminderText)
                    }, 5000);
                }
            } catch(e) {
                console.error(e);
            }
        }   
    }
   
}