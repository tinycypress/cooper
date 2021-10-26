import fetch from 'node-fetch';

import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';


export default class CalcCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'calc',
			group: 'info',
			memberName: 'calc',
			aliases: [],
			description: 'Information calc our fine community!',
			details: `Details`,
			examples: ['calc', 'calc example?'],
		});
	}

	
	async run(msg) {
		super.run(msg);

		const queryString = msg.content.trim().replace('!calc ', '');
		
		// Guard.
		if (!queryString) return COOP.MESSAGES.selfDestruct(msg, 'Must include an equation/etc for calc.');
		
		const appID = process.env.WOLFRAM_ID;
		const inputQueryStr = encodeURIComponent(queryString);
		const apiEndpoint = `https://api.wolframalpha.com/v1/simple?appid=${appID}&i=${inputQueryStr}`;

		try {		
			const result = await fetch(apiEndpoint);
	
			if (result) {	
				// Send the buffer
				return msg.channel.send(
					"**!calc result for " + queryString + "**:", 
					{ files: [Buffer.from(await result.buffer())] 
				});
			} else {
				throw new Error('API calc failed.')
			}

		} catch(e) {
			// Generate feedback flash
			COOP.MESSAGES.selfDestruct(msg, '!calc failed');
			console.log('!calc failed');
			console.error(e);
		}
    }
    
}