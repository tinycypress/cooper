import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';

export default class TimeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'time',
			group: 'community',
			memberName: 'time',
			aliases: ['tim', 'whattime', 'currenttime', 'now'],
			description: 'Time until next day',
			details: `Gives the time until the next Coop "day"`,
			examples: ['time', 'time example']
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// Check time until next day
			const dateString = (new Date((+new Date))).toUTCString();
			const timeMsg = await msg.say(`Current Time: ${dateString}`);

			// Delete after sixty seconds.
			COOP.MESSAGES.delayDelete(timeMsg, 60000);

		} catch(e) {
			console.error(e);
		}
    }
    
};