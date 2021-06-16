// import axios from 'axios';

// https://stackoverflow.com/questions/54387939/how-to-actually-use-the-data-requested-using-discord-oauth2
// https://discordjs.guide/oauth2/#authorization-code-grant-flow
export default async function AuthoriseDiscord({ query }, res) {
	// TODO: Figure out what the user is actually sent at this stage?
	res.status(200).json({
		testing: 'this access discord test.'
	});
}