import { CHANNELS, ROLES, SERVER } from "../../origin/coop.mjs";
import Database from "../../origin/setup/database.mjs";
import DatabaseHelper from "../databaseHelper.mjs";

export default class DonationHelper {

    static async process() {
        const unacknowledgedDonations = await DatabaseHelper.manyQuery({
            name: 'load-unacknowledged-donations',
            text: `SELECT * FROM donations WHERE acknowledged = false`
        });

        const coop = SERVER._coop();
        unacknowledgedDonations.map(async d => {
            const idParts = d.discord_full_username.split('#');
            const matches = await coop.members.fetch({ query: idParts[0], limit: 1 });
            if (matches) {
                const member = matches.first();

                // Give supporter role
                await ROLES.add(member, 'SUPPORTER');
                
                // Announce.
                await CHANNELS._send('TALK', `<@${member.user.id}> donated £${d.amount}, given ${ROLES._textRef('SUPPORTER')} role like all donators (any size).`);

                // Set the acknowledgement to true in database so not rewarded duplicate times.
                await Database.query({
                    text: 'UPDATE donations SET acknowledged = true WHERE id = $1',
                    values: [d.id]
                })
            }
        });
    }
}