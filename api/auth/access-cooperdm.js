import { USERS } from '../../origin/coop';
import Auth from './_auth';

export default async function AccessCooperDM(result, code) {

	console.log('Trying to authenticate someone with cooper dm method');
	console.log(code);

	
	// Check that an attempt has even been made (basic check).

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
}