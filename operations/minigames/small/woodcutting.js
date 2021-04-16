import EconomyNotifications from "../../activity/information/economyNotifications";

import SkillsHelper from "../medium/skills/skillsHelper";

import COOP, { STATE, REACTIONS, SERVER, USABLE } from "../../../origin/coop";
import { EMOJIS } from "../../../origin/config";
import Statistics from "../../activity/information/statistics";

export default class WoodcuttingMinigame {

    // Reaction interceptor to check if user is attempting to interact.
    static async onReaction(reaction, user) {
        // High chance of preventing any Woodcutting at all to deal with rate limiting.
        if (STATE.CHANCE.bool({ likelihood: 44 })) return false;

        const isOnlyEmojis = COOP.MESSAGES.isOnlyEmojisOrIDs(reaction.message.content);
        const isAxeReact = reaction.emoji.name === '🪓';
        const isCooperMsg = COOP.USERS.isCooperMsg(reaction.message);
        const isUserReact = !COOP.USERS.isCooper(user.id);
        
        // Woodcutting minigame guards.
        if (!isUserReact) return false;
        if (!isCooperMsg) return false;
        if (!isAxeReact) return false;
        if (!isOnlyEmojis) return false;

        const msgContent = reaction.message.content;

        const firstEmojiString = (msgContent[0] || '') + (msgContent[1] || '');
        const firstEmojiUni = COOP.MESSAGES.emojiToUni(firstEmojiString);
        const rockEmojiUni = COOP.MESSAGES.emojiToUni(EMOJIS.WOOD);
        const isWoodMsg = firstEmojiUni === rockEmojiUni;

        if (!isWoodMsg) return false;

        this.chip(reaction, user);
    }

    static async chip(reaction, user) {
        const msg = reaction.message;

        // Calculate magnitude from message: more rocks, greater reward.
        const textMagnitude = COOP.MESSAGES.countAllEmojiCodes(msg.content);
        const rewardRemaining = STATE.CHANCE.natural({ min: 1, max: textMagnitude * 4 });

        // Check if has a axe
        const userAxesNum = await COOP.ITEMS.getUserItemQty(user.id, 'AXE');
        const noText = `${user.username} tried to cut wood, but doesn't have an axe.`;
        // Remove reaction and warn.
        // if (userAxesNum <= 0) DELETE REACTION
        if (userAxesNum <= 0) return COOP.MESSAGES.selfDestruct(msg, noText, 0, 3333);

        // Handle chance of axe breaking
        const pickaxeBreakPerc = Math.min(25, rewardRemaining);
        
        // Calculate number of extracted wood with applied collab buff/modifier.
        const numCutters = REACTIONS.countType(msg, '🪓') - 1;
        const extractedWoodNum = Math.ceil(rewardRemaining / 1.25) * numCutters;


        const didBreak = STATE.CHANCE.bool({ likelihood: pickaxeBreakPerc });
        if (didBreak) {
            const axeUpdate = await USABLE.use(user.id, 'AXE', 1);
            if (axeUpdate) {
                const brokenDamage = -2;
                const pointsDamageResult = await COOP.POINTS.addPointsByID(user.id, brokenDamage);
                
                // Update economy statistics.
                EconomyNotifications.add('WOODCUTTING', {
                    playerID: user.id,
                    username: user.username,
                    brokenAxes: 1,
                    pointGain: brokenDamage
                });

                // Add the experience.
                SkillsHelper.addXP(user.id, 'woodcutting', 2);
                
                const actionText = `${user.username} broke an axe trying to cut wood, ${userAxesNum - 1} remaining!`;
                const damageText = `${brokenDamage} points (${pointsDamageResult}) but gained 2xp in woodcutting for trying.`;
                COOP.CHANNELS.propagate(msg, `${actionText} ${damageText}`, 'ACTIONS');
            }
        } else {
            // See if updating the item returns the item and quantity.
            const addedWood = await COOP.ITEMS.add(user.id, 'WOOD', extractedWoodNum);
            const addPoints = await COOP.POINTS.addPointsByID(user.id, 1);

            // Rare events from woodcutting.
            if (STATE.CHANCE.bool({ likelihood: 3.33 })) {
                const addDiamond = await COOP.ITEMS.add(user.id, 'AVERAGE_EGG', 1);
                COOP.CHANNELS.propagate(msg, `${user.username} catches an average egg as it falls from a tree! (${addDiamond})`, 'ACTIONS');
            }
            
            if (STATE.CHANCE.bool({ likelihood: 0.25 })) {
                const branchQty = STATE.CHANCE.natural({ min: 5, max: 25 });
                await COOP.ITEMS.add(user.id, 'RARE_EGG', branchQty);
                COOP.CHANNELS.propagate(msg, `${user.username} triggered a chain branch reaction, ${branchQty} rare eggs found!`, 'ACTIONS');
            }

            if (STATE.CHANCE.bool({ likelihood: 0.0525 })) {
                const legendaryNestQty = STATE.CHANCE.natural({ min: 2, max: 4 });
                await COOP.ITEMS.add(user.id, 'LEGENDARY_EGG', legendaryNestQty);
                COOP.CHANNELS.propagate(msg, `${user.username} hit a lucky branch, ${legendaryNestQty} legendary egg(s) found!`, 'ACTIONS');
            }

            // Reduce the number of rocks in the message.
            if (textMagnitude > 1) await msg.edit(EMOJIS.WOOD.repeat(textMagnitude - 1));
            else await msg.delete();
            
            // Provide feedback.
            const actionText = `${user.username} successfully chopped wood.`;
            const rewardText = `+1xp, +1 point (${addPoints}), +${extractedWoodNum} wood (${addedWood})!`;
            COOP.CHANNELS.propagate(msg, `${actionText} ${rewardText}`, 'ACTIONS');

            EconomyNotifications.add('WOODCUTTING', {
                pointGain: 1,
                recWood: extractedWoodNum,
                playerID: user.id,
                username: user.username
            });

            // Add the experience.
            SkillsHelper.addXP(user.id, 'woodcutting', 1);
        }
    }

    static async run() {
        const base = Math.max(1, Statistics.calcCommunityVelocity());

        let magnitude = STATE.CHANCE.natural({ min: base, max: base * 5 });

        if (STATE.CHANCE.bool({ likelihood: .8 }))
            magnitude = STATE.CHANCE.natural({ min: base * 5, max: base * 20 });

        if (STATE.CHANCE.bool({ likelihood: .05 }))
            magnitude = STATE.CHANCE.natural({ min: base * 7, max: base * 35 });

        const woodMsg = await COOP.CHANNELS._randomText().send(EMOJIS.WOOD.repeat(magnitude));

        // TODO: Count as ungathered wood in activity messages.
        SERVER.addTempMessage(woodMsg, 30 * 60);

        COOP.MESSAGES.delayReact(woodMsg, '🪓', 666);

        const branchText = magnitude > 1 ? `${magnitude} branches` : `a branch`;
        const woodcuttingEventText = `${'Ooo'.repeat(Math.floor(magnitude))} a tree with ${branchText} to fell!`
        COOP.CHANNELS._postToChannelCode('ACTIONS', woodcuttingEventText, 1222);
    }
}