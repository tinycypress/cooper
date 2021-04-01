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

    // x^3 + 3 x^2 + 3 x + 1 
    // for x= 99
    // THANK YOU ISO!!
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

    static async getSkills(memberID) {
        const result = {};

        return result;
    }

    static async getHighestSkill(skill) {

    }

    static async addXP(userID, skill, xpNum) {

        const query = {
            name: `add-player-${skill}-xp`,
            text: `INSERT INTO skills(player_id, ${skill})
                VALUES($1, $2)
                ON CONFLICT (id) DO UPDATE SET ${skill} = skills.${skill} + EXCLUDED.${skill}`,
            values: [userID, xpNum]
        };
        
        return await Database.query(query);
    }

}