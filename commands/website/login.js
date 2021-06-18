import CoopCommand from '../../operations/activity/messages/coopCommand';
import TempAccessCodeHelper from '../../operations/members/tempAccessCodeHelper';
import { USERS } from '../../origin/coop';

export default class LoginCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'login',
			group: 'website',
			memberName: 'login',
			description: 'Conveniently login to The Coop website',
			examples: ['!login']
		});
	}

	async run(msg) {
		super.run(msg);

		// Generate a saved code the web api to authenticate on link visit.
		const code = await TempAccessCodeHelper.create(msg.author.id);

		// DM the login code to the user
		USERS._dm(msg.author.id, 
			`**Your temporary login code (expiring link) is here, use it within the next 5 minutes:**\n\n` +
			'https://thecoop.group/auth/authorise?method=cooper_dm&code=' + code
		);

		// Also a way to ensure that most codes are deleted in a more timely manner and
		// also don't require a super fast setInterval =]
		// TODO: Enhancement When it expires check if it was used/deleted - if not warn them (via editing the msg...?)
		// setTimeout(() => {

		// }, TempAccessCodeHelper.expiry + 1000);
    }
    
}