import announcementOpts from "./announceOpts";
import communityOpts from "./communityOpts";
import gameOpts from "./gameOpts";

import { CHANNELS as CHANNELS_CONFIG, KEY_MESSAGES } from '../../../origin/config';
import COOP, { CHICKEN, CHANNELS } from "../../../origin/coop";
import STATE from "../../../origin/state";


export default class AboutHelper {

    // Refactor to a reduce.
    static getEmojiHandler(emoji) {
        return Object.keys(this.sectionEmojis).reduce((acc, section) => {
            const methods = this.sectionEmojis[section];
            if (typeof methods[emoji] === 'function') return acc = methods[emoji];
            return acc;
        }, null);
    }
    
    static sectionEmojis = {
        ANNOUNCEMENTS: {
            '📢': announcementOpts.announcementSubToggle, // Done
            '📰': announcementOpts.newsletterToggle, // More complex unfinished
            '☠️': announcementOpts.privacyBomb, // Most complex unfinished (need to add confirm)
        },
        FOCUS: {
            '💬': (r, user) => COOP.ROLES.toggle(user.id, 'SOCIAL'),
            '💻': (react, user) => COOP.ROLES.toggle(user.id, 'CODE'),
            '💼': (react, user) => COOP.ROLES.toggle(user.id, 'BUSINESS'),
            '🖌️': (react, user) => COOP.ROLES.toggle(user.id, 'ART')
        },
        GAMES: {
            '🎮': (react, user) => COOP.ROLES.toggle(user.id, 'GAMING'),
            '🗡': gameOpts.conquestToggle,
            '📉': gameOpts.logsToggle,
        },
        COMMUNITY: {
            '🧵': communityOpts.miscToggle, // Done
            '👷': communityOpts.projectsToggle // Done
        },
        ACADEMY_AGENCY: {
            '🏢': (react, user) => COOP.ROLES.toggle(user.id, 'AGENCY'),
            '📝': (react, user) => COOP.ROLES.toggle(user.id, 'ACADEMY')
        },
        GUIDE: {
            '📖': (react, user) => COOP.ROLES.toggle(user.id, 'GUIDE'),
        }
    }

    static optionEmojis = [
        ...Object.keys(this.sectionEmojis.ANNOUNCEMENTS),
        ...Object.keys(this.sectionEmojis.FOCUS),
        ...Object.keys(this.sectionEmojis.GAMES),
        ...Object.keys(this.sectionEmojis.COMMUNITY),
        ...Object.keys(this.sectionEmojis.ACADEMY_AGENCY),
        ...Object.keys(this.sectionEmojis.GUIDE),
    ]

    static async onReaction(reaction, user) {
        const reactEmoji = reaction.emoji.name;

        // Check if this reaction is on about channel.
        if (reaction.message.channel.id !== CHANNELS_CONFIG.ROLES.id) return false;

        // Ignore Cooper.
        if (COOP.USERS.isCooper(user.id)) return false;

        // Check if in array of interaction emojis.
        if (!this.optionEmojis.includes(reactEmoji)) return false;

        // Check if the user is a member, only members may gain access.
        const member = await COOP.USERS.loadSingle(user.id);
        if (!member) return false;

        // Map emojis to right option handler.
        const resultCallback = this.getEmojiHandler(reactEmoji);
        if (resultCallback) resultCallback(reaction, user);
    }

    static async preloadMesssages() {
        const links = [
            KEY_MESSAGES.about_notifications_msg,
            KEY_MESSAGES.about_ourfocus_msg,
            KEY_MESSAGES.about_optout_msg,
            KEY_MESSAGES.about_gamesopt_msg,
            KEY_MESSAGES.about_academyagency_msg,
            KEY_MESSAGES.about_guide_msg,
        ];
        return await COOP.MESSAGES.preloadMsgLinks(links);
    }
    
}