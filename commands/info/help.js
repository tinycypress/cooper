import CoopCommand from "../../operations/activity/messages/coopCommand";


export default class HelpCommand extends CoopCommand {

	commando = null

	constructor(client) {
		super(client, {
			name: 'help',
			group: 'info',
			memberName: 'help',
			aliases: [],
			description: 'Help will always be granted at The Coop to those who ask for it.',
			details: `Details`,
			examples: ['help', 'help prefix'],
		});

		this.commando = client;
	}

	async run(msg) {
		super.run(msg);

		// TODO: ADD STATISTICS + SATISFACTION FEEDBACK FOR HELP
		// TODO: MAKE IT WORK FOR ALIASES TOO
		
		const msgContent = msg.content.replace('!help ', '');
		// Improve hidden to filter by roles
		const hiddenCommands = [
			'nuke',

			// Added to prevent infinite loop on !help (help) text search.
			'help'
		];
		
		const hiddenGroups = [
			'mod',
			'misc'
		];

		// Store group names to detect matches and provide helpful/detailed feedback.
		const categoryNames = this.commando.registry.groups
			.filter(group => !hiddenGroups.includes(group.id))
			.map(group => group.id.toLowerCase());

		const commandNames = [];
		// Store command names to detect matches and provide helpful/detailed feedback.
		const commandsArray = [];
		this.commando.registry.commands.filter(cmd => !hiddenCommands.includes(cmd.memberName))
			.map(cmd => {
				commandNames.push(cmd.memberName.toLowerCase());

				commandsArray.push(cmd);
			});

		// Check if msgContent matches a category name and check that the msgContent is not only a part of the category name.
		let categoryName = null;
		const categoryNamesRegex = new RegExp(categoryNames.join('|'), 'g');
        const categoryMatches = categoryNamesRegex.exec(msgContent);
        if(categoryMatches) {
			categoryName =  categoryMatches.filter(categoryName => categoryName === msgContent).toString();
        }


		// Check if msgContent matches a command name and check that the command name doesn't only contain the message
		let commandName = null;
		let command = null;

		const aliasAndCmdNamesJoined = commandsArray.map(cmd => {
			return [cmd.aliases.join('|'), cmd.memberName].join('|');
		}); 
		const commandNamesRegex = new RegExp(aliasAndCmdNamesJoined.join('|'), 'g');
        const commandMatch = commandNamesRegex.exec(message);
        if (commandMatch) {
			commandName = commandMatch.filter(commandName => commandName === message).toString();

			// Try to find the command amongst aliases too.
			commands.map(cmd => {
				if (commandMatch === cmd.commandName) command = cmd;
				if (cmd.aliases.includes(commandMatch)) command = cmd;
			});
        }


        try {
			// TODO: Fix the conflict between duplicates?

			if (!categoryName && !commandName) {
				const groupsText = `**Available Command Groups**:\n\n` +
					this.commando.registry.groups
					.filter(group => !hiddenGroups.includes(group.id))
					.map((group, index) => index === 0 ? group.name : group.name.toLowerCase())
						.join(', ') + 
					`.\n\n_To find out more about a command group type and send: !help <group_name>_`;
	
				msg.direct(groupsText);
			}

			if (commandName) {
				const commandHelpText = 
					`**${commandName} specifics:**\n\n` +
					`Name: ${command.name}` +
					`Group: ${command.groupID}` +
					`Description: ${command.description}`;

				msg.direct(commandHelpText);
				
			} else if (categoryName) {
                const category = this.commando.registry.groups.get(categoryName);
                const commandsInCategory = category.commands.map(cmd => cmd.memberName);

				let categoryHelpText = `${categoryName} category doesn\'t have any commands`;

				const categoryHelpText = `**${categoryName} specifics:**\n\n` +
				`Description: ${category.name}\n` +
                `List of commands: ${commandsInCategory.join(', ')}\n`;

                msg.direct(categoryHelpText)
			}

        } catch(e) {
			console.log('Help error.')
			console.error(e);
           msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
}