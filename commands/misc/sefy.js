 import CoopCommand from '../../operations/activity/messages/coopCommand';

export default class SefyCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'sefy',
			group: 'misc',
			memberName: 'sefy',
			aliases: [],
			description: 'Information sefy our fine community!',
			details: `Details`,
			examples: ['sefy', 'sefy example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
		
        const sefyArt =
            '.    :fire::fire::fire::fire:         :fire::fire::fire::fire:     :fire::fire::fire::fire::fire:    :fire:                             :fire:\n' +
            ':fire:                      :fire:    :fire:                       :fire:                                 :fire:                     :fire:\n' +
            ':fire:                                :fire:                        :fire:                                    :fire:             :fire:\n' +
            '.    :fire:                           :fire:                        :fire:                                        :fire:    :fire:\n' +
            '.           :fire::fire:              :fire::fire::fire::fire:     :fire::fire::fire:                                 :fire:\n' +
            '.                       :fire:        :fire:                        :fire:                                             :fire: \n' +
            '.                            :fire:   :fire:                        :fire:                                             :fire: \n' +
            ':fire:                       :fire:   :fire:                        :fire:                                             :fire: \n' +
            '.    :fire::fire: :fire::fire:        :fire::fire::fire::fire:     :fire:                                             :fire:\n';


        const sefyMsg = await msg.say(sefyArt);
        await sefyMsg.react('🔥');

        setTimeout(async () => {
            await sefyMsg.edit(sefyArt.replace(/:fire:/g, '🤦‍♂️'));
            await sefyMsg.reactions.removeAll()
            await sefyMsg.react('🤦‍♂️');
        }, 5000);
    }
    
}
