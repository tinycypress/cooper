import { Command } from 'discord.js-commando';

export default class CoopCommand extends Command {

	constructor(client, config) {
		super(client, config);
	}

	async run(msg) {
		// Remove user's calling command.
		if (msg.channel.type !== 'dm')
			msg.delete();


		// TODO: Log calling command.

		// TODO: Acknowledge first coop-command usage + points/achievement too.
    }
    
}