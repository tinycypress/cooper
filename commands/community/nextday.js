import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { CHICKEN } from '../../origin/coop';

export default class NextDayCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'nextday',
			group: 'community',
			memberName: 'nextday',
			aliases: ['nd'],
			description: 'Gives the time until the next Coop "day"',
			examples: ['!nextday']
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// Check time until next day
			const timeUntilNext = await CHICKEN._nextdayis();
			const timeUntilMsg = await msg.say(`Time until next day: ${timeUntilNext}`);

			// Delete after sixty seconds.
			COOP.MESSAGES.delayDelete(timeUntilMsg, 60000);

		} catch(e) {
			console.error(e);
		}
    }
    
}