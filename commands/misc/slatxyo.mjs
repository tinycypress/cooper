 import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import { STATE } from '../../origin/coop.mjs';


export default class SlatxyoCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'slatxyo',
			group: 'misc',
			memberName: 'slatxyo',
			aliases: [],
			description: 'Information slatxyo our fine community!',
			details: `Details`,
			examples: ['slatxyo', 'slatxyo example?'],
		});
	}

	async run(msg) {

        setTimeout(() => {
            super.run(msg);

            setTimeout(async () => {
                const repeatNum = STATE.CHANCE.natural({ min: 1, max: 35 });
                const first = `Slatxyooooooooo?!?!??!!?!?!?! 🗻🗻🗻`;
                const second = 'Oooooo' + 'o'.repeat(repeatNum) + '!!!';
                const third = ('🧗' + '🇮🇳').repeat(repeatNum);

                const inklingMsg = await msg.say(first);

                setTimeout(async () => {
                    await inklingMsg.edit(second);
                    setTimeout(() => { inklingMsg.react('🧗'); }, 500);

                    setTimeout(async () => {
                        await inklingMsg.edit(third);
                        setTimeout(() => { inklingMsg.reactions.removeAll(); }, 250);
                        setTimeout(() => { inklingMsg.react('🇮🇳'); }, 500);

                        setTimeout(async () => {
                            await inklingMsg.edit(';-;');
                            setTimeout(() => { inklingMsg.reactions.removeAll(); }, 250);
                            setTimeout(() => { inklingMsg.react('😭'); }, 500);
                        }, 2000);
                    }, 3000);
                }, 3000);
            }, 300);
        }, 250);
    }
    
}
