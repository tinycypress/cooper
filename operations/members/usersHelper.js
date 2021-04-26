import _ from 'lodash';

import COOP, { SERVER, STATE } from '../../origin/coop';
import { ROLES } from '../../origin/config';
import DatabaseHelper from "../databaseHelper";
import Database from "../../origin/setup/database";

export default class UsersHelper {
    static avatar(user) {
        const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
        return avatarURL;
    }

    static _cache() {
        return SERVER._coop().members.cache;
    }

    static _get = this._getMemberByID;
    
    static _getMemberByID(id) {
        return this._cache().get(id);
    }

    static getLastMsgDateFmt(userID) {

        // TODO: Fmt.
        const member = this._getMemberByID(userID);
        console.log(member);
    }

    static getMemberByID = (guild, id) => guild.members.cache.get(id);

    static fetchMemberByID = (guild, id) => guild.members.fetch(id);

    static hasRoleID = (member, id) => {
        return member.roles.cache.get(id);
    }

    static hasRoleIDs = (guild, member, roleIDs) => 
        guild.roles.cache
            .filter(role => roleIDs.includes(role.id))
            .some(role => member.roles.cache.has(role.id));

    static hasRoleNames = (guild, member, roleNames) => 
        guild.roles.cache
            .filter(role => roleNames.includes(role.name))
            .some(role => member.roles.cache.has(role.id));

    // TODO: Refactor since fragments were turned off, this becomes a bit weirder/easier.
    static count(guild, includeCooper = false) {
        return guild.memberCount - (includeCooper ? 0 : 1);
    }

    static directMSG = (guild, userID, msg) => {
        const member = COOP.USERS.getMemberByID(guild, userID);
        if (member) member.send(msg);
    };

    static _dm(userID, msg) {
        const guild = SERVER._coop();
        this.directMSG(guild, userID, msg);
    }

    // TODO: Implement for election, maybe limit to announcement notifications.
    static _dmAll(msg) {

    }

    static getOnlineMembers = (guild) => guild.members.cache.filter(member => member.presence.status === 'online');
    
    static filterMembers = (guild, filter) => guild.members.cache.filter(filter);

    static _filter = filter => SERVER._coop().members.cache.filter(filter);

    static getOnlineMembersByRoles(guild, roleNames) {
        const notificiationRoles = guild.roles.cache.filter(role => roleNames.includes(role.name));
        
        return this.filterMembers(guild, member => {
            const matchingRoles = notificiationRoles.some(role => member.roles.cache.has(role.id));
            const isOnline = member.presence.status === 'online';
            return matchingRoles && isOnline;
        });
    }

    static getMembersByRoleID(guild, roleID) {
        return guild.members.cache.filter(member => member.roles.cache.has(roleID));
    }

    static async removeFromDatabase(member) {
        const query = {
            name: "remove-user",
            text: "DELETE FROM users WHERE discord_id = $1",
            values: [member.user.id]
        };
        return await Database.query(query);
    }

    static async addToDatabase(userID, joindate) {
        const query = {
            name: "add-user",
            text: "INSERT INTO users(discord_id, join_date) VALUES ($1, $2)",
            values: [userID, joindate]
        };
        return await Database.query(query);
    }

    static async setIntro(member, link, time) {
        const query = {
            name: "set-user-intro",
            text: 'UPDATE users SET intro_time = $1, intro_link = $2 WHERE discord_id = $3 RETURNING intro_link, intro_time',
            values: [time, link, member.user.id],
        };
        return await Database.query(query);
    }

    static async load() {
        const query = {
            name: "get-users",
            text: "SELECT * FROM users"
        };
        const result = await Database.query(query);        
        return DatabaseHelper.many(result);
    }

    static async updateField(id, field, value) {
        const query = {
            text: `UPDATE users SET ${field} = $1 WHERE discord_id = $2`,
            values: [value, id]
        };
        return await Database.query(query);
    }

    static async getField(id, field) {
        try {
            const query = {
                text: `SELECT ${field} FROM users WHERE discord_id = $1`,
                values: [id]
            };
    
            // Try to safely access the proposed field.
            let value = null;
            const result = DatabaseHelper.single(await Database.query(query));
            if (result && typeof result[field] !== 'undefined') value = result[field];
    
            return value;

        } catch(e) {
            console.log('getField error ' + field);
            console.error(e);
        }
    }
    
    static async loadSingle(id) {
        const query = {
            name: "get-user",
            text: "SELECT * FROM users WHERE discord_id = $1",
            values: [id]
        };

        const result = await Database.query(query);
        return DatabaseHelper.single(result);
    }

    static async isRegistered(discordID) {
        return !!(await this.loadSingle(discordID));
    }

    static async random() {
        const membersManager = SERVER._coop().members;
        const randomUser = await this._random();
        const member = await membersManager.fetch(randomUser.discord_id);
        return member;
    }

    static async _random() {
        const query = {
            name: "get-random-user",
            text: "SELECT * FROM users LIMIT 1 OFFSET floor(random() * (SELECT count(*) from users))"
        };
        const result = DatabaseHelper.single(await Database.query(query));
        return result;
    }

    static isCooper(id) {
        return STATE.CLIENT.user.id === id;
    }

    static isCooperMsg(msg) {
        return this.isCooper(msg.author.id);
    }

    static async getIntro(member) {
        const query = {
            name: "get-user-intro",
            text: "SELECT intro_link, intro_time FROM users WHERE discord_id = $1",
            values: [member.user.id]
        };
        
        const result = await Database.query(query);
        return DatabaseHelper.single(result);
    }
    
    static async getLastUser() {
        const query = {
            name: "get-last-user",
            text: "SELECT * FROM users WHERE id = (select max(id) from users)"
        };
        const result = await Database.query(query);
        return DatabaseHelper.single(result);
    }

    static getHierarchy() {
        const guild = SERVER._coop();
        return {
            commander: this.getMembersByRoleID(guild, ROLES.COMMANDER.id).first(),
            leaders: this.getMembersByRoleID(guild, ROLES.LEADER.id),
            memberCount: guild.memberCount
        };
    }

    static async cleanupUsers() {
        const allUsers = await this.load();
        allUsers.map((user, index) => {
            const member = this._getMemberByID(user.discord_id);
            if (!member) setTimeout(() => this.removeFromDatabase({
                user: {
                    id: user.discord_id
                }
            }), 666 * index);
        });
    }

    static async populateUsers() {
        // Constant/aesthetic only reference.
        const coopEmoji = COOP.MESSAGES._displayEmojiCode('COOP');

        // Load all recognised users.
        const dbUsers = await this.load();

        // Pluck the list of their IDs for comparison with latest data.
        const includedIDs = _.map(dbUsers, "discord_id");
        
        // Find the missing/unrecognised users (MEMBER role only).
        const allWithout = Array.from(COOP.ROLES._allWith('MEMBER')
            .filter(member => !includedIDs.includes(member.user.id)));

        // Attempt to recognise each unrecognised user.
        allWithout.forEach(async (memberSet, index) => {
            const member = memberSet[1];
            
            try {
                // Insert and respond to successful/failed insertion.
                const dbRes = await this.addToDatabase(member.user.id, member.joinedTimestamp);
                if (dbRes.rowCount === 1)
                    setTimeout(() => COOP.CHANNELS._postToFeed(
                        `<@${member.user.id}> is officially recognised by The Coop ${coopEmoji}!`
                    ), 1000 * index);
                else
                    setTimeout(() => COOP.CHANNELS._postToFeed(
                        `<@${member.user.id}> failed to be recognised by The Coop ${coopEmoji}...?`
                    ), 1000 * index);

            } catch(e) {
                console.log('Error adding unrecognised user to database.');
                console.error(e);
            }
        });
    }


}