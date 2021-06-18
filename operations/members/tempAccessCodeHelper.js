import { STATE, TIME } from "../../origin/coop";
import Database from "../../origin/setup/database";

export default class TempAccessCodeHelper {

    static expiry = 60 * 5;

    // Delete all access codes for a certain user (heavy-handed/overkill for security/safety).
    static delete(discord_id) {
        return Database.query({
            text: `DELETE FROM temp_login_codes WHERE discord_id = $1`,
            values: [discord_id]
        });
    }

    static validate(discord_id, code) {
        // Check code is correct

        // Check it has not expired

        // Validate: Return true/false.
        return true;
    }

    static async create(discord_id) {
        const code = STATE.CHANCE.string({ length: 10, pool: process.env.DISCORD_TOKEN });
        const expiry = TIME._secs() + this.expiry;

        try {
            const result = await Database.query({
                text: `INSERT INTO temp_login_codes (discord_id, code, expires_at) 
                    VALUES ($1, $2, $3)`,
                values: [discord_id, code, expiry]
            });
            console.log(result);
            
        } catch(e) {
            console.log('Error creating temp login code.')
            console.error(e);
        }

        return code;
    }
}