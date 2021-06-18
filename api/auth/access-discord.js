import { USERS } from '../../origin/coop';
import Auth from './_auth';

export default async function AccessDiscord(req, res) {
	const result = { success: false, token: null };
	
	try {
		// Check that an attempt has even been made (basic check).
		const code = req.body.code || null;
		if (!code) throw new Error('No code provided');

		// The access token will be needed once to prove the owner's identity.
		const tokenResponse = await Auth.authorizeDiscord(code);
		const authData = tokenResponse.data;
		const discordAPIaccessToken = authData.access_token || null;
		if (!discordAPIaccessToken) 
			throw new Error('Discord did not return access token.');

		// Check if user valid and check for identity match...?
		const whoisDiscordResponse = await Auth.whoisMeViaDiscord(discordAPIaccessToken);
		const user = whoisDiscordResponse.data || null;
		if (!user) 
			throw new Error('Discord did not return user data.');

		// Check the user is in the coop
		const coopMember = !!(await USERS.loadSingle(user.discord_id));
		if (!coopMember)
			throw new Error('Discord user is not a member of The Coop.');

			
		// Also pass initial user data.
		result.user = { id: user.id, username: user.username };

		// Generate (sign) a JWT token for specified user. =] Beautiful.
		result.token = Auth.token(result.user);

		result.success = true;

	} catch (error) {
		// Log the error at least during early release.
		console.error(error);

		// Return the error for the user.
		result.success = false;
		result.error = error.message;
	}
	
	// Return successful/errorful auth response. =]
	return res.status(200).json(result);
}