import CoopCommand from "../../operations/activity/messages/coopCommand";
import { MESSAGES } from "../../origin/coop";


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

		// Check if msgContent matches a category name and check that the msgContent is not only a part of the category name.
		let categoryName = null;
		const categoryNamesRegex = new RegExp(categoryNames.join('|'), 'g');
        const categoryMatches = categoryNamesRegex.exec(msgContent);
        if (categoryMatches) {
			categoryName = categoryMatches.filter(categoryName => categoryName === msgContent).toString();
        }


		const commandNames = [];
		// Store command names to detect matches and provide helpful/detailed feedback.
		const commandsArray = [];
		this.commando.registry.commands.filter(cmd => !hiddenCommands.includes(cmd.memberName))
			.map(cmd => {
				commandNames.push(cmd.memberName.toLowerCase());
				commandNames.push(...cmd.aliases);
				commandsArray.push(cmd);
			});


		// Check if msgContent matches a command name and check that the command name doesn't only contain the message
		let commandName = null;
		let command = null;

		const aliasAndCmdNamesJoined = commandsArray.map(cmd => {
			return [...cmd.aliases, cmd.memberName].join('|');
		}).join('|');

		const commandNamesRegex = new RegExp(`(?:${aliasAndCmdNamesJoined})`, 'g');
        const commandMatch = commandNamesRegex.exec(msgContent)[0] || null;

		console.log(commandMatch);

        if (commandMatch) {
			// commandName = commandMatch.filter(commandName => commandName === msgContent).toString();

			// Try to find the command amongst aliases too.
			this.commando.registry.commands.map(cmd => {
				if (commandMatch === cmd.commandName) command = cmd;
				if (cmd.aliases.includes(commandMatch)) command = cmd;

				console.log(cmd.aliases.includes(commandMatch));
			});
        }


        try {
			// TODO: Fix the conflict between duplicates?

			const visibleGroups = this.commando.registry.groups
				.filter(group => !hiddenGroups.includes(group.id))

			const fmtVisibleGroupsNames = visibleGroups
				.map(({ name }, i) => i === 0 ? MESSAGES.titleCase(name) : name.toLowerCase())
				// Add new line every 4
				.reduce((acc, name, i) => {
					if (i === visibleGroups.length - 1) acc.push(name + '.');
					else acc.push(name + ', ');
					if (i > 0 && i % 4 === 0) acc.push('\n');	
					return acc;
				}, []);

			console.log('commandName', commandName);
			console.log('command', command);
			console.log('categoryName', categoryName);
			console.log('msgContent', msgContent);

			if (!categoryName && !commandName)
				return msg.direct(`**Available Command Groups**:\n` +
				`We have the following __groups__ of commands, you can easily check the contents of each below group and view command specifics via !help <command or group name>.\n\n` +
				fmtVisibleGroupsNames.join('') + 
				`.\n\n_To find out more about a command group,\n type and send: !help <group or command name>_.`);

			if (commandName) {
				return msg.direct(`**${commandName} specifics:**\n\n` +
					`Name: ${command.name}` +
					`Group: ${command.groupID}` +
					`Description: ${command.description}`);
			}
			
			if (categoryName) {
                const category = this.commando.registry.groups.get(categoryName);
                const commandsInCategory = category.commands.map(cmd => cmd.memberName);

				// Default to empty text.
				let categoryHelpText = `${categoryName} category doesn\'t have any commands`;

				if (!commandsInCategory.length) {
					categoryHelpText = `**${categoryName} specifics:**\n\n` +
						`Description: ${category.name}\n` +
						`List of commands: ${commandsInCategory.join(', ')}\n`;
				}

                return msg.direct(categoryHelpText)
			}

        } catch(e) {
			console.log('Help error.')
			console.error(e);
			msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
}