import DatabaseHelper from "../../../../databaseHelper";
import Database from "../../../../../origin/setup/database";

import Chicken from "../../../../chicken";


// import { ROLES } from "../../../../../origin/config";
import COOP, {STATE } from "../../../../../origin/coop";



export default class PointsHelper {
    
    static async getPointsByID(id) {
        const qty = await COOP.ITEMS.getUserItemQty(id, 'COOP_POINT')
        return qty;
    }

    static async addPointsByID(id, points) {
        const addResult = await COOP.ITEMS.add(id, 'COOP_POINT', points);
        return addResult;
    }

    static async getLeaderboard(pos = 0) {
        const query = {
            name: 'get-leaderboard',
            text: `
                SELECT quantity, owner_id 
                FROM items 
                WHERE item_code = 'COOP_POINT'
                ORDER BY quantity DESC
                OFFSET $1
                LIMIT 15
            `.trim(),
            values: [pos]
        };

        const result = await Database.query(query);
        const rows = DatabaseHelper.many(result);

        return rows;
    }

    static async getAllPositive() {
        const query = {
            name: 'get-all-positive',
            text: `
                SELECT quantity, owner_id
                FROM users 
                WHERE quantity > 0 AND item_code = 'COOP_POINT'
            `.trim(),
        };
        const result = await Database.query(query);
        return result;   
    }

    static async getNegLeaderboard(pos = 0) {
        const query = {
            name: 'get-negative-leaderboard',
            text: `
                SELECT quantity, owner_id 
                FROM items
                ORDER BY quantity ASC
                OFFSET $1
                LIMIT 15
            `.trim(),
            values: [pos]
        };

        const result = await Database.query(query);
        const rows = DatabaseHelper.many(result);

        return rows;
    }

    static async getHighest() {
        const query = {
            name: 'get-highest-points-user',
            text: `SELECT * FROM items
                WHERE item_code = 'COOP_POINT' 
                ORDER BY quantity DESC LIMIT 1`
        };
        return DatabaseHelper.single(await Database.query(query));
    }


    static async getPercChange(userID) {
        const oldPoints = (await COOP.USERS.getField(userID, 'historical_points')) || 0;
        const qty = await COOP.ITEMS.getUserItemQty(userID, 'COOP_POINT')
        const diff = qty - oldPoints;
        let percChange = (diff / oldPoints) * 100;

        // Prevent the weird unnecessary result that occurs without it.
        // Defies mathematical/js sense...? Maybe string/int type collision.
        if (isNaN(percChange)) percChange = 0;

        return {
            user: userID,
            points: qty,
            lastWeekPoints: oldPoints,
            percChange
        };
    }

    static async updateMOTW() {
        try {
            // Check time since last election commentation message (prevent spam).
            const lastMOTWCheck = parseInt(await Chicken.getConfigVal('last_motwcheck_secs'));
            const hour = 3600;
            const week = hour * 24 * 7;
            const fresh = COOP.TIME._secs() <= lastMOTWCheck + week;
            if (fresh) return false;
    
            // Load player points and historical points.
            const users = await COOP.USERS.load();
            const updateData = [];
            const percChanges = await Promise.all(users.map(async (user) => {
                // TODO: Can optimise by skilling users with no points.
                const result = await this.getPercChange(user.discord_id);
    
                if (result.points !== result.lastWeekPoints)
                    updateData.push({ id: result.user, points: result.points });
    
                return result;
            }));
    
            // Sort the points changes by highest (positive) perc change first.
            percChanges.sort((a, b) => {
                if (a.percChange === Infinity) return 1;
                if (a.percChange < 0) return 1;
                if (a.percChange >= b.percChange) return -1;
                if (a.percChange === b.percChange) return 0;
            });
    
            const membersOfWeek = COOP.ROLES._allWith('MEMBEROFWEEK');
    
            // Check if that winner has the role already.
            const highestChange = percChanges[0];
    
            // Remove other member of the week.
            let hadAlready = false;
            let prevWinner = null;
            await membersOfWeek.map(member => {
                if (member.id !== highestChange) {
                    prevWinner = member;
                    return COOP.ROLES._remove(member.id)
                } else {
                    // Found already, won twice in a row. Bonus?
                    hadAlready = true;
                    return true
                }
            });
            
            // Build update text for check/status.
            let updateText = `**MOTW check ran!**\n`;
    
            if (hadAlready) {
                // Declare they won again.
                updateText = `**MOTW check ran and <@${highestChange.user}> wins again!**\n\n`
            } else {
                // Give the winner the role.
                COOP.ROLES._add(highestChange.user, 'MEMBEROFWEEK');
    
                // Took it from previous winner.
                if (prevWinner) {
                    updateText = `**MOTW check ran and <@${highestChange.user}> seizes the role from <@${prevWinner.id}>!**\n\n`;
                } else {
                    updateText = `**MOTW check ran and <@${highestChange.user}> seizes the role!**\n\n`;
                }
            }
    
            // Add reasoning.
            updateText += `<@${highestChange.user}> was selected by MOTW as the best/most promising member this week!\n\n`;
    
            // TODO: Show 3/4 runners up.
    
    
            // Give the winner the reward.
            const cpDisplay = COOP.MESSAGES._displayEmojiCode('COOP_POINT');
            await COOP.ITEMS.add(highestChange.user, 'COOP_POINT', 30);
            updateText += `_Given 50${cpDisplay} for MOTW reward._`;


            // TODO: Give them 1-2 weeks of sacrifice protection too

            // TODO: Give them some random eggs and items.

    
            // Inform the community.
            COOP.CHANNELS._codes(['FEED', 'TALK'], updateText, {
                allowedMentions: { users: [], roles: [] }
            });
            
            // Make sure all historical_points are updated.
            updateData.map(({ id, points }) => COOP.USERS.updateField(id, 'historical_points', points));
    
            // Ensure Cooper knows when the last time this was updated (sent).
            // Track member of week by historical_points DB COL and check every week.
            Chicken.setConfig('last_motwcheck_secs', COOP.TIME._secs());

            // Send DM :D
            COOP.USERS._dm(highestChange.user, 'You were given MEMBER OF THE WEEK reward! Check talk channel for more info.');

        } catch(e) {
            console.log('Error updating MOTW');
            console.error(e);
        }
    }

    static async updateCurrentWinner() {
        const highestRecord = await this.getHighest();

        const mostPointsRole = COOP.ROLES._getByCode('MOSTPOINTS');
        
        const mostPointsMember = COOP.USERS._get(highestRecord.owner_id);
        const username = mostPointsMember.user.username;
        
        let alreadyHadRole = false;

        // Remove the role from previous winner and commiserate.
        let prevWinner = null;
        mostPointsRole.members.map(prevMostMember => {
            if (prevMostMember.user.id === highestRecord.owner_id) alreadyHadRole = true;
            else {
                prevWinner = prevMostMember.user;
                prevMostMember.roles.remove(mostPointsRole);
            }
        });

        // If the new winner didn't already have the role, award it and notify server.
        if (!alreadyHadRole) {
            let successText = `${username} is now the point leader.`;
            if (prevWinner) successText = ` ${username} overtakes ${prevWinner.username} for most points!`;

            const pointsAfter = await this.addPointsByID(highestRecord.owner_id, 5);
            successText += ` Given MOST POINTS role and awarded 5 points (${pointsAfter})!`;

            COOP.CHANNELS._postToFeed(successText);
            mostPointsMember.roles.add(mostPointsRole);
        }
    }


    static async renderLeaderboard(leaderboardRows, position = 0) {
        const guild = COOP.SERVER.getByCode(STATE.CLIENT, 'PROD');
        const rowUsers = await Promise.all(leaderboardRows.map(async (row, index) => {
            let username = '?';
            try {
                const member = await guild.members.fetch(row.owner_id);
                username = member.user.username;

            } catch(e) {
                console.log('Error loading user via ID');
                console.error(e);
            }
            return {
                username,
                rank: index + position,
                points: row.quantity
            }
        }));

        let leaderboardMsgText = '```\n\n ~ POINTS LEADERBOARD ~ \n\n' + 
            rowUsers.map(user => `${user.rank + 1}. ${user.username} ${user.points}`).join('\n') +
            '```';

        return leaderboardMsgText
    }
}