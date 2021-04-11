import EconomyNotifications from "../../activity/information/economyNotifications";

import SkillsHelper from "../medium/skills/skillsHelper";

import UsableItemHelper from "../medium/economy/items/usableItemHelper";

import COOP, { STATE, REACTIONS, SERVER } from "../../../origin/coop";
import { EMOJIS } from "../../../origin/config";
import { baseTickDur } from "../../manifest";

export default class MiningMinigame {
    
    static INTERVAL = baseTickDur * 6;

    // Reaction interceptor to check if user is attempting to interact.
    static async onReaction(reaction, user) {
        // High chance of preventing any mining at all to deal with rate limiting.
        if (STATE.CHANCE.bool({ likelihood: 40 })) return false;

        const isOnlyEmojis = COOP.MESSAGES.isOnlyEmojis(reaction.message.content);
        const isPickaxeReact = reaction.emoji.name === '⛏️';
        const isCooperMsg = COOP.USERS.isCooperMsg(reaction.message);
        const isUserReact = !COOP.USERS.isCooper(user.id);
        
        // Mining minigame guards.
        if (!isUserReact) return false;
        if (!isCooperMsg) return false;
        if (!isPickaxeReact) return false;
        if (!isOnlyEmojis) return false;

        const msgContent = reaction.message.content;

        const firstEmojiString = (msgContent[0] || '') + (msgContent[1] || '');
        const firstEmojiUni = COOP.MESSAGES.emojiToUni(firstEmojiString);
        const rockEmojiUni = COOP.MESSAGES.emojiToUni(EMOJIS.ROCK);
        const isRocksMsg = firstEmojiUni === rockEmojiUni;

        if (isRocksMsg) this.chip(reaction, user);
    }

    // TODO: Bomb skips a few places at random
    static async chip(reaction, user) {
        const msg = reaction.message;

        // Calculate magnitude from message: more rocks, greater reward.
        const textMagnitude = Math.floor(msg.content.length / 2);
        const rewardRemaining = STATE.CHANCE.natural({ min: 1, max: textMagnitude * 2 });

        // Check if has a pickaxe
        const userPickaxesNum = await COOP.ITEMS.getUserItemQty(user.id, 'PICK_AXE');
        const noPickText = `${user.username} tried to mine the rocks, but doesn't have a pickaxe.`;
        // Remove reaction and warn.
        // if (userPickaxesNum <= 0) DELETE REACTION
        if (userPickaxesNum <= 0) return COOP.MESSAGES.selfDestruct(msg, noPickText, 0, 3000);

        // Handle chance of pickaxe breaking
        const pickaxeBreakPerc = Math.min(25, rewardRemaining);

        // Calculate number of extracted pickaxe with applied collab buff/modifier.
        const numCutters = REACTIONS.countType(msg, '⛏️') - 1;
        const extractedOreNum = Math.ceil(rewardRemaining / 1.5) * numCutters;

        // Test the pickaxe for breaking.
        const didBreak = STATE.CHANCE.bool({ likelihood: pickaxeBreakPerc });
        if (didBreak) {
            const pickaxeUpdate = await UsableItemHelper.use(user.id, 'PICK_AXE', 1);
            if (pickaxeUpdate) {
                const brokenPickDamage = -2;
                const pointsDamageResult = await COOP.POINTS.addPointsByID(user.id, brokenPickDamage);
                
                // Update mining economy statistics.
                EconomyNotifications.add('MINING', {
                    playerID: user.id,
                    username: user.username,
                    brokenPickaxes: 1,
                    pointGain: brokenPickDamage
                });    

                // Add the experience.
                SkillsHelper.addXP(user.id, 'mining', 2);

                const actionText = `${user.username} broke a pickaxe trying to mine, ${userPickaxesNum - 1} remaining!`;
                const damageText = `${brokenPickDamage} points (${pointsDamageResult}) but gained mining 2xp for trying!.`;
                COOP.CHANNELS.propagate(msg, `${actionText} ${damageText}`, 'ACTIONS');
            }
        } else {
            // See if updating the item returns the item and quantity.
            const addMetalOre = await COOP.ITEMS.add(user.id, 'METAL_ORE', extractedOreNum);
            const addPoints = await COOP.POINTS.addPointsByID(user.id, 1);
            let diamondsFound = 0;

            if (STATE.CHANCE.bool({ likelihood: 3.33 })) {
                diamondsFound = 1;
                const addDiamond = await COOP.ITEMS.add(user.id, 'DIAMOND', diamondsFound);
                COOP.CHANNELS.propagate(msg, `${user.username} found a diamond whilst mining! (${addDiamond})`, 'ACTIONS');
            }
            
            if (STATE.CHANCE.bool({ likelihood: 0.25 })) {
                diamondsFound = STATE.CHANCE.natural({ min: 5, max: 25 });
                await COOP.ITEMS.add(user.id, 'DIAMOND', diamondsFound);
                COOP.CHANNELS.propagate(msg, `${user.username} hit a major diamond vein, ${diamondsFound} found!`, 'ACTIONS');
            }

            // Add the experience.
            SkillsHelper.addXP(user.id, 'mining', 1);

            EconomyNotifications.add('MINING', {
                pointGain: 1,
                recOre: extractedOreNum,
                playerID: user.id,
                username: user.username,
                diamondsFound
            });

            // Reduce the number of rocks in the message.
            if (textMagnitude > 1) await msg.edit(EMOJIS.ROCK.repeat(textMagnitude - 1));
            else await msg.delete();
            
            // Provide feedback.
            const metalOreEmoji = COOP.MESSAGES._displayEmojiCode('METAL_ORE');
            const actionText = `${user.username} successfully mined a rock.`;
            const rewardText = `+1 point (${addPoints}), +${extractedOreNum} ${metalOreEmoji} (${addMetalOre})!`;
            COOP.CHANNELS.propagate(msg, `${actionText} ${rewardText}`, 'ACTIONS');
        }
    }

    static async run() {
        let magnitude = STATE.CHANCE.natural({ min: 1, max: 3 });

        // TODO: Adjust points and diamond rewards if more rocks
        // Add rare chances of a lot of rocks
        if (STATE.CHANCE.bool({ likelihood: .8 }))
            magnitude = STATE.CHANCE.natural({ min: 5, max: 20 });

        if (STATE.CHANCE.bool({ likelihood: .05 }))
            magnitude = STATE.CHANCE.natural({ min: 7, max: 35 });

        const rockMsg = await COOP.CHANNELS._randomText().send(EMOJIS.ROCK.repeat(magnitude));
        
        // Ensure message is stored in database for clear up.
        // TODO: Count as ungathered rock in activity messages.
        SERVER.addTempMessage(rockMsg, 30 * 60);

        COOP.MESSAGES.delayReact(rockMsg, '⛏️');

        COOP.CHANNELS._postToChannelCode('ACTIONS', `Rockslide! Magnitude ${magnitude}!`, 1222);
    }
}