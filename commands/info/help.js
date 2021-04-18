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

		// Store command names to detect matches and provide helpful/detailed feedback.
		const commandNames = [];
		this.commando.registry.commands.filter(cmd => !hiddenCommands.includes(cmd.memberName))
			.map(cmd => commandNames.push(cmd.memberName.toLowerCase()));

		// Check if message matches a category name and check that the message is not only a part of the category name.
		let categoryName = null;
		const categoryNamesRegex = new RegExp(categoryNames.join('|'), 'g');
        const categoryMatches = categoryNamesRegex.exec(msg.content);
        if(categoryMatches) {
			categoryName =  categoryMatches.filter(categoryName => categoryName === msg.content).toString();
        }
		// Check if message matches a command name and check that the command name doesn't only contain the message
		let commandName = null
		const commandNamesRegex = new RegExp(commandNames.join('|'), 'g');
        const commandMatch = commandNamesRegex.exec(msg.content);
        if(commandMatch) {
			commandName =  commandMatch.filter(commandName => commandName === msg.content).toString();
        }

		// console.log('commandMatches', commandMatches);

        try {
			// TODO: Implement properly.

			if (!categoryName && !commandName) {
				const groupsText = `**Available Command Groups**:\n\n` +
					this.commando.registry.groups
					.filter(group => !hiddenGroups.includes(group.id))
					.map((group, index) => {
						return index === 0 ? group.name : group.name.toLowerCase();
					}).join(', ') + 
					`.\n\n_To find out more about a command group type and send: !help <group_name>_`;
	
				console.log(groupsText);
			}

			if (commandName) {
				let command = this.commando.registry.commands.get(commandName);
				const commandHelpText = 
				`
				**${commandName} specifics:**\n\n
				name: ${command.name}
				group: ${command.groupID}
				description: ${command.description}
				`

				console.log(commandHelpText);
				
			} else if (categoryName) {
                let category = this.commando.registry.groups.get(categoryName);
                let commandsInCategory = [];
                category.commands.forEach(command => commandsInCategory.push(command.memberName));
				const categoryHelpText = 
				`
				**${categoryName} specifics:**\n\n
                list of commands: ${commandsInCategory.length ?  commandsInCategory.join(', ') : 'this category doesn\'t have any commands'}
                `
                console.log(categoryHelpText)
			}

        } catch(e) {
			console.log('Help error.')
			console.error(e);
           console.log('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
}