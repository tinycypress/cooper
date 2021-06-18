import AccessCooperDM from "./access-cooperdm";
import AccessDiscord from "./access-discord";

export default async function Access(req, res) {
	let result = { success: false, token: null };
	
	try {
		// Check that an attempt has even been made (basic check).
		const code = req.body.code || null;
		if (!code) throw new Error('No code provided');

		// Check method is provided.
		const method = req.body.method || 'discord_oauth';
		if (!method) throw new Error('No method provided');


		// Adjust the result based on strategy method specified.
		if (method === 'cooper_dm') 
			result = AccessCooperDM(result, code);

		else if (method === 'discord_oauth') 
			result = AccessDiscord(result, code);

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