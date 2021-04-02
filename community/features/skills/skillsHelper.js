import DatabaseHelper from "../../../core/entities/databaseHelper";
import Database from "../../../core/setup/database";


export const SKILLS = {
    CRAFTING: {},
    MAGIC: {},   
    MINING: {},  
    WOODCUTTING: {},
    FISHING: {},
    HUNTING: {}
};

export const DEFAULT_LEVEL = 1;

export default class SkillsHelper {

    static dbSkills = Object.keys(SKILLS).map(skill => skill.toLowerCase());

    static async getXP(skill, playerID) {
        let xp = 0;

        const query = {
            name: `get-user-${skill}-xp`,
            text: `SELECT ${skill.toLowerCase()} FROM "skills" WHERE player_id = $1`,
            values: [playerID]
        };

        const result = DatabaseHelper.single(await Database.query(query));
        if (result && typeof result[skill] !== 'undefined') xp = result[skill];

        return xp;
    }

    // Calculate the xp from the level.
    static calcXP(level) {
        const conversion = level * level * level + 3 * level * level + 3 * level + 1;
        return Math.round(conversion);
    }

    static calcLvl(num) {
        const xpLvlConversion = Math.pow(num, 1 / 3) - 1;
        return Math.round(this.clampLvl(xpLvlConversion, 1, 99));
    }

    // Refactor to a mathematics part.
    // Or use lodash again, already in node_modules.`
    static clampLvl(num, min, max) {
        return Math.max(min, Math.min(num, max));
    }

    static async getLevel(skill, playerID) {
        let level = DEFAULT_LEVEL;

        // Player xp.
        const xp = await this.getXP(skill, playerID);

        // Calculate level.
        level = this.calcLvl(xp);

        return level;
    }

    static async getAllSkills(playerID) {
        const query = {
            name: `get-user-skills`,
            text: `SELECT * FROM "skills" WHERE player_id = $1`,
            values: [playerID]
        };

        const result = DatabaseHelper.single(await Database.query(query));
        return result;
    }

    static async getSkills(playerID) {
        const result = {};

        const skillData = await this.getAllSkills(playerID);

        Object.keys(SKILLS)
            .map(skill => skill.toLowerCase())
            .map(skill => {
                result[skill] = { level: 1, xp: 0 };

                // If xp data, calculate level and set xp for result.
                if (skillData && skillData[skill]) {
                    result[skill].xp = skillData[skill];
                    result[skill].level = this.calcLvl(result[skill].xp);
                }
        });

        return result;
    }

    // TODO: Useful for skills leaderboard.
    static async getHighestSkill(skill) {

    }

    // TODO: Useful for skills leaderboard.
    static async getHighestAllSkills() {

    }

    static async addXP(userID, skill, xpNum) {
        return await Database.query({
            name: `add-player-${skill}-xp`,
            text: `INSERT INTO skills(player_id, ${skill})
                VALUES($1, $2)
                ON CONFLICT (player_id) DO UPDATE SET ${skill} = skills.${skill} + EXCLUDED.${skill}`,
            values: [userID, xpNum]
        });
    }


    static async getTotalXPLeaderboard(pos = 0) {
        const summingQueryFmt = this.dbSkills.map(skill => `COALESCE(${skill}, 0)`);

        return await DatabaseHelper.manyQuery({
            name: `get-total-xp-leaderboard`,
            text: `
                SELECT player_id, (${summingQueryFmt.join(' + ')}) AS total_xp
                FROM skills 
                ORDER BY total_xp DESC
                OFFSET $1
                LIMIT 15
            `.trim(),
            values: [pos]
        });
    }

    static async getSkillXPLeaderboard(skill, pos = 0) {
        return await DatabaseHelper.manyQuery({
            name: `get-${skill}-xp-leaderboard`,
            text: `
                SELECT player_id, ${skill}
                FROM skills 
                ORDER BY ${skill} DESC
                OFFSET $1
                LIMIT 15
            `.trim(),
            values: [pos]
        });
    }

}