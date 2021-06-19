import { SlashCommand } from 'slash-create';
import TempAccessCodeHelper from '../../../operations/members/tempAccessCodeHelper';
import { USERS } from '../../coop';

export default class LoginCommand extends SlashCommand {
    
    constructor(creator) {
        super(creator, {
            name: 'login',
            description: 'Helps you login to our glorious The Coop website.'
        });
        this.filePath = __filename;
    }

    async run(ctx) {
		// Generate a saved code the web api to authenticate on link visit.
		const code = await TempAccessCodeHelper.create(ctx.user.id);

		// DM the login code to the user
		return USERS._dm(ctx.user.id, 
			`**Your temporary login code (expiring link) is here, use it within the next 5 minutes:**\n\n` +
			'https://thecoop.group/auth/authorise?method=cooper_dm&code=' + code
		);
    }
}