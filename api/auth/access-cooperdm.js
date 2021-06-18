import TempAccessCodeHelper from '../../operations/members/tempAccessCodeHelper';
import TimeHelper from '../../operations/timeHelper';
import Auth from './_auth';


// TODO: Send them another message confirming their login? (Later problem)
// TOOD: Post it to actions channel for some logging/visibility (at least during early release).

export default async function AccessCooperDM(result, code) {
	// Check validation result =]
	const matchingRequest = await TempAccessCodeHelper.validate(code);
	if (!matchingRequest)
		throw new Error('Cooper DM login request not found.');
	
	// Check it hasn't expired.
	if (TimeHelper._secs() >= matchingRequest.expires_at)
		throw new Error('Temporary login code expired.');
	
	// Generate (sign) a JWT token for specified user. =] Beautiful.
	result.token = Auth.token(matchingRequest.discord_id);
	result.success = true;

	// Delete all login requests for that user.
	TempAccessCodeHelper.delete(matchingRequest.discord_id);
}