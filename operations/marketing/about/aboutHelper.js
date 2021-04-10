import announcementOpts from "./announceOpts";
import communityOpts from "./communityOpts";
import gameOpts from "./gameOpts";

import { CHANNELS, KEY_MESSAGES } from '../../../origin/config';
import COOP, { CHICKEN } from "../../../origin/coop";


export default class AboutHelper {

    // Refactor to a reduce.
    static getEmojiHandler(emoji) {
        let handler = null;
        Object.keys(this.sectionEmojis).map(section => {
            const methods = this.sectionEmojis[section];
            if (typeof methods[emoji] === 'function')
                handler = methods[emoji];
        });
        return handler;
    }

    static getEmojiHandler(emoji) {
        return Object.keys(this.sectionEmojis).reduce((acc, section) => {
            const methods = this.sectionEmojis[section];
            if (typeof methods[emoji] === 'function') return acc = methods[emoji];
            return acc;
        }, null);
    }
    
    static sectionEmojis = {
        ANNOUNCEMENTS: {
            '❗': announcementOpts.keyInfoToggle, // Done
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
            '🤝': gameOpts.economyToggle, // Done
            '🗡': gameOpts.conquestToggle // Done
        },
        COMMUNITY: {
            '🧵': communityOpts.miscToggle, // Done
            '👷': communityOpts.projectsToggle // Done
        },
        ACADEMY_AGENCY: {
            '🏢': (react, user) => COOP.ROLES.toggle(user.id, 'AGENCY'),
            '📝': (react, user) => COOP.ROLES.toggle(user.id, 'ACADEMY')
        }
    }

    static optionEmojis = [
        ...Object.keys(this.sectionEmojis.ANNOUNCEMENTS),
        ...Object.keys(this.sectionEmojis.FOCUS),
        ...Object.keys(this.sectionEmojis.GAMES),
        ...Object.keys(this.sectionEmojis.COMMUNITY),
        ...Object.keys(this.sectionEmojis.ACADEMY_AGENCY)
    ]

    static async onReaction(reaction, user) {
        const reactEmoji = reaction.emoji.name;

        // Check if this reaction is on about channel.
        if (reaction.message.channel.id !== CHANNELS.ABOUT.id) return false;

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
            KEY_MESSAGES.about_community_msg,
            KEY_MESSAGES.about_notifications_msg,
            KEY_MESSAGES.about_ourfocus_msg,
            KEY_MESSAGES.about_optout_msg,
            KEY_MESSAGES.about_gamesopt_msg,
            KEY_MESSAGES.about_academyagency_msg
        ];
        return await COOP.MESSAGES.preloadMsgLinks(links);
    }


    static async addAboutStats() {
        // Edit latest member message.
        const last = await COOP.USERS.getLastUser();
        const lastMember = COOP.USERS._getMemberByID(last.discord_id);
        const lastJoinLink = await CHICKEN.getConfigVal('about_lastjoin_msg');
        await COOP.MESSAGES.editByLink(lastJoinLink, `**Latest Member**\n` +
            `${lastMember.user.username} was our latest member!`
        );
        
        // post leaderboard to economy
        const leaderboardMsgLink = await CHICKEN.getConfigVal('about_leaderboard_msg');
        const leaderboardRows = await COOP.POINTS.getLeaderboard(0);
        const leaderboardMsgText = await COOP.POINTS.renderLeaderboard(leaderboardRows);
        await COOP.MESSAGES.editByLink(leaderboardMsgLink, leaderboardMsgText);
    }

}