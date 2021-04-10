import nodeEval from 'node-eval';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import { STATE } from '../../origin/coop';


export default class EvalCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'eval',
			group: 'mod',
			memberName: 'eval',
			aliases: [],
			description: 'Raw node.',
			details: `Raw.`,
			examples: ['eval', 'eval example? -> raw'],
		});
	}

	async run(msg) {
		super.run(msg);

		if (msg.author.id === '786671654721683517') {
			const evalStr = msg.content.replace('!eval ', '');
			nodeEval(evalStr, { msg });
		}
    }
    
};