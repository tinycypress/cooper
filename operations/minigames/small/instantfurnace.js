import COOP, { STATE, SERVER, USABLE } from "../../../origin/coop";
import { EMOJIS } from "../../../origin/config";

export const BAR_DATA = {
    GOLD_BAR: {
        FAIL_RATE: 90
    }, 
    SILVER_BAR: {
        FAIL_RATE: 75
    }, 
    STEEL_BAR: {
        FAIL_RATE: 50
    },
    IRON_BAR: {
        FAIL_RATE: 33
    }
};

export default class InstantFurnaceMinigame {

    // Burn metal ore into metal
    static async onReaction(reaction, user) {
        // Reject all N/A
        if (!COOP.USERS.isCooper(reaction.message.author.id)) return false;
        if (COOP.USERS.isCooper(user.id)) return false;
        if (reaction.message.content.trim() !== '🌋') return false;
        if (reaction.emoji.name !== 'metal_ore') return false;
        
        try {
            // Uses a random amount of their metal ore.
            const oreLimitMin = 25;

            // Check the quantity for the user.
            const hasQty = await COOP.ITEMS.hasQty(user.id, 'METAL_ORE', oreLimitMin);
            if (!hasQty) return COOP.MESSAGES.selfDestruct(reaction.message, `${user.username} lacks ${oreLimitMin}xMETAL_ORE.`, 0, 5000);

            // Guard the action from those not sincerely using the item.
            const didUse = await USABLE.use(user.id, 'METAL_ORE', oreLimitMin);
            if (!didUse) return COOP.MESSAGES.selfDestruct(reaction.message, `${user.username}, something went wrong smelting your ore. ;(`, 5000);

            // Add smelting multiplier effect.
            const multiplier = reaction.count - 1;
            
            // Calculate smelting rewards.
            const rewards = {};
            const barTypes = Object.keys(BAR_DATA);
            for (let i = 0; i < oreLimitMin; i++) {
                // Roll out of 100 and select rarity.
                const rollNum = STATE.CHANCE.natural({ min: 0, max: 100 });
                const barType = STATE.CHANCE.pickone(barTypes);

                // Apply failure rate.
                if (rollNum < BAR_DATA[barType].FAIL_RATE) continue;
                if (typeof rewards[barType] === 'undefined') rewards[barType] = 0;
                rewards[barType] = rewards[barType] + (1 * multiplier);
            }

            // Add rewards to user.
            await Object.keys(rewards).map(rewardItem => {
                const qty = rewards[rewardItem];
                return COOP.ITEMS.add(user.id, rewardItem, qty)
            });

            const sumTotal = Object.keys(rewards).reduce((acc, val) => {
                return acc + rewards[val];
            }, 0);

            const smeltString = `${user.username} smelted the following ${sumTotal} bars within the instant furnace: \n` +
                `${
                    Object.keys(rewards).map(rewardKey => {
                        return `${COOP.MESSAGES._displayEmojiCode(rewardKey)}x${rewards[rewardKey]}`
                    }).join(', ')
                }`

            // Create record in channel and in actions.
            COOP.CHANNELSpropagate(reaction.message, smeltString, 'ACTIONS');

        } catch(e) {
            console.log('Failure reacting to instant furnace');
            console.error(e);
        }
    }

    static async spawn() {
        // Run based on roll.
        try {
            // An instant furnace appears.
            const msg = await COOP.CHANNELS_postToChannelCode('TALK', '🌋');
            
            // TODO: Maybe should be self-destruct too?
            // baseTickDur / 10

            // Hurts the person next to it on spawn.
            // console.log(msg);

            
            // TODO: Animate flame out like egg collect.
            await SERVER.addTempMessage(msg, 60);

            // Add reaction for action suggestion/tip.
            COOP.MESSAGES.delayReact(msg, EMOJIS.METAL_ORE, 333);

        } catch(e) {
            console.log('Error running instance furnace.');
            console.error(e);
        }
    }

    static async run() {
        // Run based on roll.
        try {
            await this.spawn();

        } catch(e) {
            console.log('Error running instance furnace.');
            console.error(e);
        }
    }


}