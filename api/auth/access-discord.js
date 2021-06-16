import axios from 'axios';


// https://stackoverflow.com/questions/54387939/how-to-actually-use-the-data-requested-using-discord-oauth2
// https://discordjs.guide/oauth2/#authorization-code-grant-flow
export default async function AccessDiscord({ query }, response) {
	const { code } = query;

	if (code) {
		try {
			const oauthResult = await axios.post('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: process.env.DISCORD_ID,
					client_secret: process.env.DISCORD_APPSECRET,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:${port}`,
					scope: 'identify'
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await oauthResult.json();
			console.log(oauthData);

		} catch (error) {
            // TODO: Add the error that will not be thrown to handle in one catch?
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
		}
	}



});
