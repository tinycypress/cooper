import Axios from "axios";

import COOP, { MESSAGES, STATE } from "../../../origin/coop.mjs";
import { CHANNELS } from "../../../origin/config.mjs";

import EggHuntMinigame from "../../minigames/small/egghunt.mjs";

export default class MiscMessageHandlers {

    static async onMessage(msg) {

        // Check if someone is trying to troll with the egg.
        EggHuntMinigame.antiTroll(msg);

        
        if (msg.author.id === '287062661483724810' && STATE.CHANCE.bool({ likelihood: 1.5 })) {
            COOP.MESSAGES.delayReact(msg, '🥚', 666);
        }

        if (msg.author.id === '237600741471027201') {
            if (STATE.CHANCE.bool({ likelihood: 5 })) msg.react(':owl:');
        }

        if (msg.author.id === '625419764411662366') {
            if (STATE.CHANCE.bool({ likelihood: 5 })) msg.react('☁️');
        }

        if (msg.author.id === '420314059968217088') {
            if (STATE.CHANCE.bool({ likelihood: 5 })) msg.react('🐬');
        }

        if (msg.content.toLowerCase() === 'i-' && !COOP.USERS.isCooperMsg(msg) && STATE.CHANCE.bool({ likelihood: 25 })) 
            msg.say('U-? Finish your sentence!');

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

        if (STATE.CHANCE.bool({ likelihood: 25 })) {
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

        // One for Arron
        if (msg.author.id === '431178585089245184' && STATE.CHANCE.bool({ likelihood: 0.5 }))
            COOP.MESSAGES.delayReact(msg, '🏃', 333);


        // One for Solaris
        if (msg.author.id === '346149426479235074' && STATE.CHANCE.bool({ likelihood: 1.5 })) {
            COOP.MESSAGES.delayReact(msg, '✨', 333);
            STATE.CHANCE.bool({ likelihood: 5 })
                COOP.MESSAGES.delayReact(msg, '💫', 666);

            STATE.CHANCE.bool({ likelihood: 2.5 })
                MESSAGES.silentSelfDestruct(msg, '( ´･ω･)', 0, 3000);
        }

        if (msg.author.id === '837582425164873739' && STATE.CHANCE.bool({ likelihood: 1.5 })) {
            COOP.MESSAGES.delayReact(msg, '🍄', 666);
        }
        

    }
}