import { USERS } from '../../origin/coop';
import Auth from './_auth';

export default async function AccessCooperDM(req, res) {
	const result = { success: false, token: null };
	
	try {
		// Check that an attempt has even been made (basic check).
		const code = req.body.code || null;
		if (!code) throw new Error('No code provided');

		// Check if the login request is in the table.

		// TODO: Send them another message confirming their login? (Later problem)

		// Load the user from the code

		// Post it to actions channel for some logging/visibility (at least during early release).

		// Generate (sign) a JWT token for specified user. =] Beautiful.
		// const token = Auth.token({ id: user.id, username: user.username });
		
		// // Modify the response the user deserves.
		// result.user = { 
		// 	id: user.id, 
		// 	username: user.username, 
		// 	discriminator: user.discriminator 
		// };
		// result.token = token;
		// result.success = true;

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