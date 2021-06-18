import axios from 'axios';
import Auth from './_auth';

const whoisMeViaDiscord = accessToken =>
	axios.get('https://discord.com/api/users/@me', {
		headers: { authorization: `Bearer ${accessToken}` }
	});

const authorizeDiscord = (code) => 
	axios.post('https://discord.com/api/oauth2/token', 
		new URLSearchParams({
			client_id: process.env.DISCORD_APPID,
			client_secret: process.env.DISCORD_CLIENT_SECRET,
			code,
			grant_type: 'authorization_code',
			redirect_uri: `https://thecoop.group/auth/discord-oauth`,
			scope: 'identify'
		}),
		{ headers: {  'Content-Type': 'application/x-www-form-urlencoded' }}
	);

// https://stackoverflow.com/questions/54387939/how-to-actually-use-the-data-requested-using-discord-oauth2
// https://discordjs.guide/oauth2/#authorization-code-grant-flow
export default async function AccessDiscord(req, res) {
	const result = { success: false, token: null };
	
	try {
		// Convert this to singular file and handle both?

		const code = req.body.code || null;
		if (!code) throw new Error('No code provided');

		const tokenResponse = await authorizeDiscord(code);
		const authData = tokenResponse.data;

		console.log('authData', authData);

		// The access token will be needed once to prove the owner's identity.
		const discordAPIaccessToken = authData.access_token || null;

		console.log('discordAPIaccessToken', discordAPIaccessToken);

		if (!discordAPIaccessToken) 
			throw new Error('Discord did not return access token.');

		// Check if user valid and check for identity match...?
		const whoisDiscordResponse = await whoisMeViaDiscord(discordAPIaccessToken);
		const user = whoisDiscordResponse.data || null;
		
		console.log("user", user);

		if (!user) 
			throw new Error('Discord did not return user data.');
		

		// TODO: ...
		// Check the user is in the coop

		// if (!user) 
			// throw new Error('Discord user is not a member of The Coop.');

		// Generate (sign) a JWT token for specified user. =] Beautiful.
		const token = Auth.token({ id, username  } = user);
		
		// Modify the response the user deserves.
		result.user = { id, username, discriminator } = user;
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