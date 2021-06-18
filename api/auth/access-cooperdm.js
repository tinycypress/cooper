import TempAccessCodeHelper from '../../operations/members/tempAccessCodeHelper';
import { USERS } from '../../origin/coop';
import Auth from './_auth';

export default async function AccessCooperDM(result, code) {

	console.log('Trying to authenticate someone with cooper dm method');
	console.log(code);

	// Check validation result =]
	const validationResult = await TempAccessCodeHelper.validate(code);
	console.log('validation result');
	console.log(validationResult);
	
	

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


	// TODO: Delete the code row so it cannot be used again (after the user).
	
}

	// TODO: Send them another message confirming their login? (Later problem)
	// TOOD: Post it to actions channel for some logging/visibility (at least during early release).