import COOP from '../../../origin/coop';
import Database from '../../../origin/setup/database';
import { EMOJIS } from '../../../origin/config';

export default class SubscriptionHelper {
   
    // Send newsletter
    // Send message in talk and feed with link
    // Update website/latest article version
    static release() {}

    // Get members email list but also potential non-members subscribers.
    static getCompleteList() {
    }

    // Check if email address is within message, if so... add it for them.
    static async onMessage(msg) {
        // Only allow in DMs.
        if (msg.channel.type !== 'dm') return null;

        // Ignore Cooper for this.
        if (COOP.USERS.isCooperMsg(msg)) return null;

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

            setTimeout(async () => {
                try {
                    // Await approval for addition.
                    const collected = await confirmMsg.awaitReactions((reaction, user) => (
                            !COOP.USERS.isCooper(user.id) &&
                            [EMOJIS.POLL_FOR, EMOJIS.POLL_AGAINST].includes(reaction.emoji.name)
                        ), 
                        { max: 1, time: 60000, errors: ['time'] }
                    );

                    const reaction = collected.first();
                    const confirmed = reaction.emoji.name === EMOJIS.POLL_FOR;

                    if (!confirmed) return confirmMsg.reply('Submission declined.');

                    // Add their email to database.
                    const subscription = await this.subscribe(msg.author.id, email);

                    // Handle new subscription.
                    if (subscription.success && subscription.newLead) 
                        confirmMsg.reply('Thank you for subscribing via email.');
                    
                    // Handle existing subscription modification.
                    else if (subscription.success && !subscription.newLead) 
                        confirmMsg.say('Your email address was updated.');
                    
                } catch(e) {
                    confirmMsg.reply('Confirmation fail. Try again by stating your email.');
                    console.log('Subscription creation fail.');
                    console.error(e);
                }
            }, 1333);
        }
    }

    static create(email, owner = null, level = 1) {
        return Database.query({
            name: 'create-subscription',
            text: `INSERT INTO propaganda_subscriptions
                (email, level, owner_id, subscribed_at) 
                VALUES($1, $2, $3, $4)`,
            values: [email, level, owner, TIME._secs()]
        });
    }

    static getEmailFromMessage(msg) {
        let email = null;

        const emailMatches = msg.content.match(/\S+@\S+\.\S+/);
        if (emailMatches) email = emailMatches[0];

        return email;
    }

    static async getByEmail(email) {
        return Database.query({
            name: 'get-subscription-by-email',
            text: `SELECT * FROM propaganda_subscriptions WHERE email = $1`,
            values: [email]
        });
    }

    static async subscribe(userID, email) {
        const subscription = {
            newLead: false,
            success: false
        };

        try {
            // Check current value in that column of database.
            const subscription = await this.getByEmail(email);

            // If email was already known, modify the record (anon -> tied to known user)
            if (subscription && !subscription.owner_id)
                this.upgradeAnonSubscription(subscription.id, userID);

            // If email was not already known, create a new subscription.
            else if (!subscription) {
                subscription.newLead = true;
                this.create(email, userID, 1);
            }

            subscription.success = true;
        } catch(e) {
            console.error(e);
        }
        return subscription;
    }

    // If email was already known, modify the record (anon -> tied to known user)
    static async upgradeAnonSubscription(subscriptionID, userID) {
        const query = {
            name: "upgrade-anon-subscription",
            text: 'UPDATE propaganda_subscriptions SET owner_id = $2 WHERE id = $1',
            values: [subscriptionID, userID]
        };
        const response = await Database.query(query);
        return response;    
    }

    // Set user's email to "UNSUBSCRIBED", remember to filter out later. >.>
    static unsubscribeByOwner(userID) {
        return Database.query({
            name: 'unsubscribe-by-owner',
            text: `DELETE FROM propaganda_subscriptions WHERE owner_id = $1`,
            values: [userID]
        });
    }

    static unsubscribeByEmail(email) {
        return Database.query({
            name: 'unsubscribe-by-email',
            text: `DELETE FROM propaganda_subscriptions WHERE email = $1`,
            values: [email]
        });
    }
}


// // Reward them, but not if their email address was set to an unsubscribed default.
// if (subscription.newLead && subscription.success) {
//     const username = msg.author.username;
//     const rewardText = `Thank you for subscribing ${username}. `;
//     const rewardAmountText = `+25 points, +5 AXE, +5 PICKAXE rewarded!`;

//     COOP.ITEMS.add(msg.author.id, 'COOP_POINT', 25, 'Email subscription reward');
//     COOP.ITEMS.add(msg.author.id, 'AXE', 5, 'Email subscription reward');
//     COOP.ITEMS.add(msg.author.id, 'PICK_AXE', 5, 'Email subscription reward');

//     setTimeout(async () => {
//         COOP.CHANNELS._postToFeed(rewardText + rewardAmountText);
//         confirmMsg.say(rewardText + rewardAmountText);
//     }, 3000);

// // Provide update feedback too!
// } else if (subscription.success) confirmMsg.say('Your email address was updated.');