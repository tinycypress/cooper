import TempAccessCodeHelper from '../../operations/members/tempAccessCodeHelper';
import TimeHelper from '../../operations/timeHelper';
import Auth from './_auth';


// TODO: Send them another message confirming their login? (Later problem)
// TOOD: Post it to actions channel for some logging/visibility (at least during early release).

export default async function AccessCooperDM(result, code) {
	// Check validation result =]
	const request = await TempAccessCodeHelper.validate(code);
	if (!request)
		throw new Error('Cooper DM login request not found.');
	
	// Check it hasn't expired.
	if (TimeHelper._secs() >= request.expires_at)
		throw new Error('Temporary login code expired.');

	// Generate (sign) a JWT token for specified user. =] Beautiful.
	result.token = Auth.token(request.discord_id);
	result.success = true;
	result.user = { id: request.discord_id };

	return result;
}