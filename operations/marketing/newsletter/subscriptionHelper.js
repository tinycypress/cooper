import COOP from '../../../origin/coop';
import { EMOJIS } from '../../../origin/config';

export default class SubscriptionHelper {
   
    // Check if email address is within message, if so... add it for them.
    static async onMessage(msg) {
        if (msg.channel.type === 'dm' && !COOP.USERS.isCooperMsg(msg)) {
            const email = this.getEmailFromMessage(msg);
            if (email) {
                const detectText = '**Email Address Detected:**\n';
                const actionText = `You seem to be trying to add or update your Coop email address. \n\n`;
                const termsText = `**You may unsubscribe** at any time using the **!unsubscribe command**, ` +
                    `your email will not be visible to anyone and is used solely for our newsletter/relay. \n\n` +
                    `_If you would like your email to be public, for example a business email - we will make this possible soon!_`;
                const confirmText = `\n\nPlease confirm ${email} is your email in the next 60 secs using the emoji reactions!`;

                const confirmEmailText = detectText + actionText + termsText + confirmText;
                const confirmMsg = await msg.say(confirmEmailText);

                // Avoid rate limiting/hammering network.
                COOP.MESSAGES.delayReact(confirmMsg, EMOJIS.POLL_FOR, 333);
                COOP.MESSAGES.delayReact(confirmMsg, EMOJIS.POLL_AGAINST, 666);
                setTimeout(() => {
                    // Await approval for addition.
                    confirmMsg.awaitReactions(
                        (reaction, user) => {
                            return (
                                !COOP.USERS.isCooper(user.id) &&
                                [EMOJIS.POLL_FOR, EMOJIS.POLL_AGAINST].includes(reaction.emoji.name)
                            );
                        }, 
                        { max: 1, time: 60000, errors: ['time'] }
                    )
                        .then(async (collected) => {
                            const reaction = collected.first();
                    
                            if (reaction.emoji.name === EMOJIS.POLL_FOR) {

                                // Acknowledge receipt of confirmation.
                                await confirmMsg.reply('Thank you for confirming your email.');
                                
                                // Add their email to database.
                                const subscription = await this.subscribe(msg.author.id, email);
                                
                                // Reward them, but not if their email address was set to an unsubscribed default.
                                if (subscription.newLead && subscription.success) {
                                    const username = msg.author.username;
                                    const rewardText = `Thank you for subscribing ${username}. `;
                                    const rewardAmountText = `+25 points, +5 AXE, +5 PICKAXE rewarded!`;

                                    COOP.POINTS.addPointsByID(msg.author.id, 25);
                                    COOP.ITEMS.add(msg.author.id, 'AXE', 5);
                                    COOP.ITEMS.add(msg.author.id, 'PICK_AXE', 5);

                                    setTimeout(async () => {
                                        COOP.CHANNELS_postToFeed(rewardText + rewardAmountText);
                                        confirmMsg.say(rewardText + rewardAmountText);
                                    }, 3000);

                                // Provide update feedback too!
                                } else if (subscription.success) confirmMsg.say('Your email address was updated.');

                                
                            } else confirmMsg.reply('You declined to confirm, personal data not saved.');
                        })
                        .catch((e) => {
                            console.error(e);
                            confirmMsg.reply('Confirmation fail. Try again by stating your email.')
                        });
                }, 1333);
            }
        }
    }

    static getEmailFromMessage(msg) {
        let email = null;

        const emailMatches = msg.content.match(/\S+@\S+\.\S+/);
        if (emailMatches) email = emailMatches[0];

        return email;
    }

    static async subscribe(userID, email) {
        const subscription = {
            newLead: false,
            success: false
        }

        try {
            // Check current value in that column of database.
            const user = await COOP.USERS.loadSingle(userID);
            if (!user.email) subscription.newLead = true;

            // Add email to member list.
            await this._setEmail(userID, email);

            subscription.success = true;
        } catch(e) {
            console.error(e);
        }
        return subscription;
    }

    static async _setEmail(userID, emailOrStatus) {
        await COOP.USERS.updateField(userID, 'email', emailOrStatus)
    }

    static guestSubscribe() {}

    // Set user's email to "UNSUBSCRIBED", remember to filter out later. >.>
    static unsubscribe(userID) {
        this._setEmail(userID, 'UNSUBSCRIBED');
    }

    static guestUnsubscribe() {
        // Remove email from guest subscribers list.
    }

    // Send newsletter
    // Send message in talk and feed with link
    // Update website/latest article version
    static release() {}

    // Get members email list but also potential non-members subscribers.
    static getCompleteList() {
    }
}