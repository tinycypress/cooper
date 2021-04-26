import { EMOJIS } from '../../../origin/config';
import { ROLES, USERS } from '../../../origin/coop';

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
        return this.countType(message, EMOJIS[codeType]);
    }

    static defaultAwaitSingleOpts = {
        max: 1, time: 60000, errors: ['time']
    };

    static defaultAwaitManyOpts = {
        max: 1000, time: 60000, errors: ['time']
    };

    // handleConsentSingleVoteMsg - In other words... a self-confirmation prompt?

    static handleConsentManyVoteMsg(msgRef, filterFn, opts = this.defaultAwaitManyOpts) {
        return msgRef.awaitReactions(filterFn, opts);
    }



    static _usersEmojisAwait(msgRef, emojis = []) {
        return this.defaultAwaitManyOpts(msgRef,
            // Construct the await reactions filter.
            ({ emoji }, user) => {
                // Make sure user has MEMBER role.
                const isMember = ROLES._idHasCode(user.id, 'MEMBER');
    
                // Only allow the two voting emojis for this calculation.
                const isValidEmoji = emojis.includes(emoji.name);
    
                // Disallow Cooper
                const isCooper = USERS.isCooper(user.id);

                // Test conditions for this proposed reaction/interaction.
                return isValidEmoji && !isCooper && isMember;
            }
        );
    }

}