import ITEMS from '../../../../core/config/items.json';
import { didUseGuard } from '../../../../core/entities/commands/guards/itemCmdGuards';
import MessagesHelper from '../../../../core/entities/messages/messagesHelper';
import UsersHelper from '../../../../core/entities/users/usersHelper';
import BuffsHelper, { BUFF_TYPES } from '../../conquest/buffsHelper';
import ItemsHelper from '../itemsHelper';

// What does the shield do: Start typing squidling.
export default class RPGHandler {

    // Intercept item usages via emoji reactions.
    static async onReaction(reaction, user) {
        const reactEmojiFlake = `:${reaction.emoji.name}:${reaction.emoji.id}`;

        // Confirm reaction is shield before processing.  
        if (reactEmojiFlake !== ItemsHelper.codeToFlake('RPG')) return false;

        // Prevent Cooper from having an effect.
        if (UsersHelper.isCooper(user.id)) return false;

        // TODO: Add emoji here, Can add another emoji reaction suitable param(?) to pass , ':shield:'
        // Attempt to use the shield item
        const didUse = await didUseGuard(user, 'RPG', reaction.message, ItemsHelper.codeToFlake('RPG'));
        if (!didUse) return false;

        const result = this.runEffect(reaction.message.author, reaction.message, user);
    }


    // Allow people to use the items without having to react to a message.
    static async use(msg) {
        // Attempt to use the shield item
        const didUse = await didUseGuard(msg.author, 'RPG', msg, ItemsHelper.codeToFlake('RPG'));
        if (!didUse) return false;

        // Run effect which also provides feedback.
        this.runEffect(msg.author.id);
        return true;
    }


    static runEffect(target, msg, attacker) {
        console.log('Running RPG effect.');

        // TODO: Add an effect here for RPG
        const rpgEmojiText = MessagesHelper._displayEmojiCode('RPG');
        const targetName = target.id === user.id ? 'their self' : target.username;
        const successText = `${attacker.username} used an ${rpgEmojiText} RPG on ${targetName}, blasting them and potentially starting a chain reaction!`;
        MessagesHelper.selfDestruct(msg, successText, 0, 15000);


        // if (BuffsHelper.has('INVINCIBILITY', targetID))
    }
   
}