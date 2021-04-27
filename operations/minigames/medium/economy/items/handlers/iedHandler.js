// import { usedOwnedUsableGuard } from "../../itemCmdGuards";
// import COOP, { USABLE, STATE } from '../../origin/coop';
import { USABLE } from '../../origin/coop';


export default class IEDHandler {

    // Arm the IED on a message.
    static async arm() {

    }

    static async onReaction(reaction, user) {       
        // TODO: Change the emoji, wrong!
        if (reaction.emoji.name === '💣') {
            try {
                // TODO: Change the itemcode, wrong!
                const didUse = await USABLE.use(user.id, 'BOMB', 1);
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
    
                    //     // Add visuals animation
                    //     COOP.MESSAGES.delayReactionRemove(reaction, 333);
                    //     COOP.MESSAGES.delayReact(reaction.message, '💥', 666);
    
                    //     let doubledInfo = '';
                    //     if (reaction.count > 1) doubledInfo = `(x${reaction.count})`;
                    //     const subjectsInvolved = `${user.username} bombed ${messageAuthor.username}`;
                    //     const changesOccurred = `${damage}${doubledInfo} points (${updatedPoints}).`;
                    //     await COOP.CHANNELS._postToFeed(`${subjectsInvolved}: ${changesOccurred}`);
                    // }, 5000);
                }
            } catch(e) {
                console.error(e);
            }
        }   
    }
   
}