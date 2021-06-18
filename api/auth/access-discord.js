import { USERS } from '../../origin/coop';
import Auth from './_auth';



// https://stackoverflow.com/questions/54387939/how-to-actually-use-the-data-requested-using-discord-oauth2
// https://discordjs.guide/oauth2/#authorization-code-grant-flow
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
		const coopMember = !!(await USERS.loadSingle(user.id));
		console.log('coopMember', coopMember);
		if (!coopMember)
			throw new Error('Discord user is not a member of The Coop.');

		// Generate (sign) a JWT token for specified user. =] Beautiful.
		const token = Auth.token({ id: user.id, username: user.username });
		
		// Modify the response the user deserves.
		result.user = { 
			id: user.id, 
			username: user.username, 
			discriminator: user.discriminator 
		};
		result.token = token;
		result.success = true;

	} catch (error) {
		console.error(error);

		result.success = false;
		result.error = error.message;
	}
	
	// Return successful/errorful auth response. =]
	return res.status(200).json(result);
}