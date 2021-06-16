import axios from 'axios';


// https://stackoverflow.com/questions/54387939/how-to-actually-use-the-data-requested-using-discord-oauth2
// https://discordjs.guide/oauth2/#authorization-code-grant-flow
export default async function AccessDiscord({ query }, res) {
	const { code } = query;
	const result = { success: false, token: null };

	if (code) {
		try {
			const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
				new URLSearchParams({
					client_id: process.env.DISCORD_APPID,
					client_secret: process.env.DISCORD_CLIENT_SECRET,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `https://cooperchickenbot.herokuapp.com/auth/access-discord`,
					scope: 'identify'
				}),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);

			console.log(tokenResponse);
			console.log(tokenResponse.data);

			const authData = tokenResponse.data;
			
			console.log(authData);

			// Validate.
			result.token = token;
			result.success = true;

		} catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
			
            // TODO: Add the error that will not be thrown to handle in one catch?

			result.success = false;
			result.error = error.message;
		}
	}
	
	// TODO: Figure out what the user is actually sent at this stage?
	res.status(200).json(result);
}