import EggHuntMinigame from "../../minigames/small/egghunt";

import COOP, { STATE } from "../../../origin/coop";
import { CHANNELS } from "../../../origin/config";
import Axios from "axios";

export default class MiscMessageHandlers {

    static async onMessage(msg) {

        // Check if someone is trying to troll with the egg.
        EggHuntMinigame.antiTroll(msg);



        // If message added by Ktrn that is only emojis, react to it.
        // TODO: Does not respond to messages contain EXTERNAL server emojis due to isOnlyEmojisOrIDs shortcoming.
        if (msg.author.id === '652820176726917130' && COOP.MESSAGES.isOnlyEmojisOrIDs(msg.content)) {
            if (STATE.CHANCE.bool({ likelihood: 25 }))
                setTimeout(() => { msg.react('🐇'); }, 666);
            
            if (STATE.CHANCE.bool({ likelihood: 25 }))
                setTimeout(() => { msg.react('🐰'); }, 666);
        }


        if (msg.author.id === '237600741471027201') {
            if (STATE.CHANCE.bool({ likelihood: 5 })) msg.react(':owl:');
        }

        if (msg.author.id === '625419764411662366') {
            if (STATE.CHANCE.bool({ likelihood: 5 })) msg.react('☁️');
        }

        // Bruh-roulette.
        const twentyPercRoll = STATE.CHANCE.bool({ likelihood: 20 });
        const isBruh = msg.content.toLowerCase().indexOf('bruh') > -1;
        const isBreh = msg.content.toLowerCase().indexOf('breh') > -1;
        
        // TODO: Account for bruuuh
        if ((isBreh || isBruh) && !COOP.USERS.isCooperMsg(msg)) {
            let type = 'bruh';
            if (isBreh) type = 'breh';
            const updatedPoints = await COOP.ITEMS.add(msg.author.id, 'COOP_POINT', twentyPercRoll ? 1 : -1, 'b-roulette');
            setTimeout(async () => {
                const feedbackMsg = await msg.say(
                    `${twentyPercRoll ? '+1' : '-1'} point, ${type}. ` +
                    `${msg.author.username} ${twentyPercRoll ? 'won' : 'lost'} ${type}-roulette. (${updatedPoints})!`
                );

                COOP.MESSAGES.delayDelete(feedbackMsg, 15000);

                setTimeout(() => {
                    if (STATE.CHANCE.bool({ likelihood: 1.5 })) {
                        COOP.CHANNELS._postToFeed(`Well, that's unfortunate... ${msg.author.username} was kicked for saying ${type}.`);
                        COOP.USERS._dm(msg.author.id, `You hit the 1.5% chance of being kicked for saying ${type}.`);
                        msg.member.kick();
                    }
                }, 1222);
            }, 666);
        }

        if (msg.content.toLowerCase() === 'i-' && !COOP.USERS.isCooperMsg(msg) && twentyPercRoll) msg.say('U-? Finish your sentence!');


        // If sefy facepalm's add recursive facepalm.
        if (msg.content.indexOf('🤦‍♂️') > -1 && msg.author.id === '208938112720568320') msg.react('🤦‍♂️');

        const target = msg.mentions.users.first();
        if (target) {

            // If targetting Cooper.
            if (COOP.USERS.isCooper(target.id)) {
                if (msg.content.indexOf(';-;') > -1) msg.say(';-;');
                if (msg.content.indexOf('._.') > -1) msg.say('._.');
                if (msg.content.indexOf(':]') > -1) msg.say(':]');
                if (msg.content.indexOf(':}') > -1) msg.say(':}');
                if (msg.content.indexOf(':3') >-1) msg.say(':3');

                if (
                    msg.content.indexOf('hate you') > -1 ||
                    msg.content.indexOf('fuck you') > -1 ||
                    msg.content.indexOf('die') > -1 ||
                    msg.content.indexOf('stupid') > -1 ||
                    msg.content.indexOf('dumb') > -1 ||
                    msg.content.indexOf('idiot') > -1 ||
                    msg.content.indexOf('retard') > -1 ||
                    msg.content.indexOf('gay') > -1 ||
                    msg.content.indexOf('ugly') > -1
                ) {
                    setTimeout(async () => {
        
                        // Implement chance-based to rate limit and make easter egg not every time/ubiquitous.
                        if (STATE.CHANCE.bool({ likelihood: 22.5 })) {
                            const endpoint = 'https://api.fungenerators.com/taunt/generate?category=shakespeare&limit=1';
                            const result = (await Axios.get(endpoint)).data || null;
                            const insults = (result.contents || null).taunts || null;
                            if (insults) msg.say(insults[0]);
                        }
                    }, 250);
                }
            }
        }

        if (twentyPercRoll) {
            if (msg.content.toLowerCase().indexOf('marx') > -1) msg.react('☭');
            if (msg.content.toLowerCase().indexOf('socialism') > -1) msg.react('☭');
            if (msg.content.toLowerCase().indexOf('redistribute') > -1) msg.react('☭');
            if (msg.content.toLowerCase().indexOf('taxes') > -1) msg.react('☭');
            if (msg.content.toLowerCase().indexOf('capitalism') > -1) msg.react('💰');
            if (msg.content.toLowerCase().indexOf('bread') > -1) msg.react('🍞');

            if (msg.content.toLowerCase().indexOf('weed') > -1) msg.react('🌿');

            // Intercept inklingboi
            if (msg.author.id === '687280609558528000') {
                const inklingboiSmileys = [':0', ':-:', ';-;', ';--;', '._.'];
                if (inklingboiSmileys.includes(msg.content)) msg.react('😉');
            }
        }


        // Randon for sal
        if (msg.author.id === '443416818963578881') {
            if (STATE.CHANCE.bool({ likelihood: 2.5 })) COOP.MESSAGES.delayReact(msg, '💙', 333);
        }

        // Add easter egg for ghost
        if (msg.author.id === '407913114818969611') {
            if (STATE.CHANCE.bool({ likelihood: 2.5 })) {
                COOP.MESSAGES.delayReact(msg, '👀', 333);
            }

            if (STATE.CHANCE.bool({ likelihood: 0.5 })) {
                COOP.MESSAGES.delayReact(msg, '👻', 333);
            }
        }

        // Add chance of adding emojis to LF infrequently
        if (msg.author.id === '697781570076934164') {
            if (STATE.CHANCE.bool({ likelihood: 2.5 })) {
                COOP.MESSAGES.delayReact(msg, '🐧', 333);

                if (STATE.CHANCE.bool({ likelihood: 2.5 }))
                    COOP.MESSAGES.delayReact(msg, '🤍 ', 666);
            }
        }

        if (msg.author.id === '763258365186801694') {
            if (STATE.CHANCE.bool({ likelihood: 1.5 }))
                COOP.MESSAGES.delayReact(msg, '🧼', 333);            
        }


        if (msg.author.id === '697781570076934164') {
            if (STATE.CHANCE.bool({ likelihood: 1.5 }))
                COOP.MESSAGES.delayReact(msg, '🐧', 333);            
        }

        
        // Add chance of adding mountain snow to slatxyo message :mountain_snow:
        if (msg.author.id === '498409882211581962') {
            if (STATE.CHANCE.bool({ likelihood: 2.5 }))
                COOP.MESSAGES.delayReact(msg, '🏔️', 333);
        }

        // Random encouragement for ZeePheesh
        if (msg.author.id === '272479872792920065') {
            if (STATE.CHANCE.bool({ likelihood: 2.5 }) && msg.channel.id === CHANNELS.DIFFRACTION.id)
                COOP.MESSAGES.delayReact(msg, '🛩️', 333);

            // if (STATE.CHANCE.bool({ likelihood: 2.5 }) && msg.channel.id === CHANNELS.SOLATWAR.id)
                // COOP.MESSAGES.delayReact(msg, '🪐', 333);
        }

        // Luni, based.
        if (msg.author.id === '266840470624272385' && msg.content.toLowerCase().indexOf('based') > -1) {
            msg.react('⚾');
        }

        if (STATE.CHANCE.bool({ likelihood: 25 }) && msg.author.id === '266840470624272385' && msg.content === '?') {
            msg.say('?');
        }

        // surprise lmf, i hope this works ;--;
        if (msg.author.id === '786671654721683517' && STATE.CHANCE.bool({ likelihood: 1.5 }))
            COOP.MESSAGES.delayReact(msg, '737182281130704936', 333);

        // Surprise Ortia. :D
        if (msg.author.id === '268163597371310082' && STATE.CHANCE.bool({ likelihood: 0.5 }))
            COOP.MESSAGES.delayReact(msg, '✡️', 333);

        if (msg.author.id === '268163597371310082' && STATE.CHANCE.bool({ likelihood: 0.25 }))
            COOP.MESSAGES.delayReact(msg, '🚿', 333);

    }
}