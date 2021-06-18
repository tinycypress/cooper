import axios from 'axios';
import Auth from './_auth';


const authorizeDiscord = async (code) => 
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
		const code = req.body.code || null;
		if (!code) throw new Error('No code provided');

		const tokenResponse = await authorizeDiscord(code);

		console.log(tokenResponse);
		console.log(tokenResponse.data);		
		console.log(authData);

		// TODO: Ensure we prove this is AUTHORIZED them.
		
		// Generate token for debugging.
		const authData = tokenResponse.data;
		const token = Auth.token();

		// Validate.
		result.user = {
			username: 'unknown',
			status: 'this is a work in progress'
		}
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