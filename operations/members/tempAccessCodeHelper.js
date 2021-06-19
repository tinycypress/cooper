import { TIME, CHANCE } from "../../origin/coop";
import Database from "../../origin/setup/database";
import DatabaseHelper from "../databaseHelper";

// TODO: Make sure they are deleted with interval (do it from worker).
export default class TempAccessCodeHelper {

    static expiry = 60 * 5;

    // Delete all access codes for a certain user (heavy-handed/overkill for security/safety).
    static delete(discord_id) {
        return Database.query({
            text: `DELETE FROM temp_login_codes WHERE discord_id = $1`,
            values: [discord_id]
        });
    }

    static async validate(code) {
        // Check code is correct
        console.log('validating cooper dm code', code)

        const result = await DatabaseHelper.singleQuery({
            text: `SELECT * FROM temp_login_codes WHERE code = $1`,
            values: [code]
        });

        console.log('validation resu;t');
        console.log(result);

        if (result) {

            // Check it has not expired
            // if (result) ...
            return result;
        }

        // Validate: Return true/false.
        return false;
    }

    static async create(discord_id) {
        // I removed the special characters because sometimes the codes weren't matching,
        // this made me suspicious some dots from the token or other characters may not encodeURI/play nicely.
        const nonUrlBreakingPool = process.env.DISCORD_TOKEN.replace(/[^a-zA-Z0-9 ]/g, "");
        const code = CHANCE.string({ length: 50, pool: nonUrlBreakingPool });
        const expiry = TIME._secs() + this.expiry;

        try {
            await Database.query({
                text: `INSERT INTO temp_login_codes (discord_id, code, expires_at) 
                    VALUES ($1, $2, $3)`,
                values: [discord_id, code, expiry]
            });
            
        } catch(e) {
            console.log('Error creating temp login code.')
            console.error(e);
        }

        return code;
    }
}