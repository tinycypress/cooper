 import CoopCommand from '../../operations/activity/messages/coopCommand';

export default class SefyCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'sefy2',
			group: 'misc',
			memberName: 'sefy2',
			aliases: [],
			description: 'Information sefy2 our fine community!',
			details: `Details`,
			examples: ['sefy2', 'sefy2 example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
        const sefyArt =
            '.    :white_check_mark::white_check_mark::white_check_mark::white_check_mark:         :white_check_mark::white_check_mark::white_check_mark::white_check_mark:     :white_check_mark::white_check_mark::white_check_mark::white_check_mark::white_check_mark:    :white_check_mark:                             :white_check_mark:\n' +
            ':white_check_mark:                      :white_check_mark:    :white_check_mark:                       :white_check_mark:                                 :white_check_mark:                     :white_check_mark:\n' +
            ':white_check_mark:                                :white_check_mark:                        :white_check_mark:                                    :white_check_mark:             :white_check_mark:\n' +
            '.    :white_check_mark:                           :white_check_mark:                        :white_check_mark:                                        :white_check_mark:    :white_check_mark:\n' +
            '.           :white_check_mark::white_check_mark:              :white_check_mark::white_check_mark::white_check_mark::white_check_mark:     :white_check_mark::white_check_mark::white_check_mark:                                 :white_check_mark:\n' +
            '.                       :white_check_mark:        :white_check_mark:                        :white_check_mark:                                             :white_check_mark: \n' +
            '.                            :white_check_mark:   :white_check_mark:                        :white_check_mark:                                             :white_check_mark: \n' +
            ':white_check_mark:                       :white_check_mark:   :white_check_mark:                        :white_check_mark:                                             :white_check_mark: \n' +
            '.    :white_check_mark::white_check_mark: :white_check_mark::white_check_mark:        :white_check_mark::white_check_mark::white_check_mark::white_check_mark:     :white_check_mark:                                             :white_check_mark:\n';


        const sefyMsg = await msg.say(sefyArt);
        await sefyMsg.react('✅');

        setTimeout(async () => {
            await sefyMsg.edit(sefyArt.replace(/:white_check_mark:/g, '🌟'));
            await sefyMsg.reactions.removeAll()
            await sefyMsg.react('🌟');
        }, 5000);
    }
    
}
