import { EMOJIS } from '../../../origin/config';

export default class ReactionHelper {

    // Check if the user with specified ID reacted to a message with a certain emoji.
    static didUserReactWith(msg, userID, emoji) {
        let didReactWith = false;

        // Check reactions for user with that reaction.
        msg.reactions.cache.map(react => {
            if (react.emoji.name === emoji && react.users.cache.has(userID)) 
                didReactWith = true;
        });

        return didReactWith;
    }

    // Count the types of emoji on message by emoji name.
    static countType(message, type) {
        let count = 0;
        message.reactions.cache.map(reaction => {
            if (reaction.emoji.name === type) count = reaction.count;
        });
        return count;
    }

    static countTypeCode(message, codeType) {
        let count = 0;

        const type = EMOJIS[codeType];
        message.reactions.cache.map(reaction => {
            if (reaction.emoji.name === type) count = reaction.count;
        });
        return count;
    }

}