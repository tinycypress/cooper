import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { STATE } from '../../origin/coop';


export default class BanCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'ban',
			group: 'misc',
			memberName: 'ban',
			aliases: [],
			description: '!ban information is classified',
			details: `Details`,
			examples: ['ban', 'ban example?'],
		});
	}

	async run(msg) {
        super.run(msg);

        // Check if it is sefy trying the command.

        // If it is sefy
        // You are being banned in 2...
        // You are being banned in 1...
        // sefy does not have the power to ban you.

        if (msg.author.id !== '208938112720568320') return msg.say('Only sefy can pretend to ban people.')
        else {
            //         const repeatNum = STATE.CHANCE.natural({ min: 1, max: 20 });
            COOP.MESSAGES.selfDestruct(msg, 'You are being banned in 3...', 333);
            COOP.MESSAGES.selfDestruct(msg, 'You are being banned in 2...', 1333);
            COOP.MESSAGES.selfDestruct(msg, 'You are being banned in 1...', 2333);
            COOP.MESSAGES.selfDestruct(msg, 'sefy cannot ban you.', 3333);
        }
    }
    
}

