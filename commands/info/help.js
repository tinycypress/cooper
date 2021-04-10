import CoopCommand from "../../operations/activity/messages/coopCommand";


const textSplitter = (str, l) => {
    const strs = [];
    while(str.length > l){
        let pos = str.substring(0, l).lastIndexOf(' ');
        pos = pos <= 0 ? l : pos;
		strs.push(str.substring(0, pos));
		
		let i = str.indexOf(' ', pos)+1;
        if(i < pos || i > pos+l) i = pos;
        str = str.substring(i);
    }
    strs.push(str);
    return strs;
}

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
		this.commando.registry.groups.map(group => group.commands
			.filter(cmd => !hiddenCommands.includes(cmd.memberName))
			.map(cmd => commandNames.push(cmd.memberName.toLowerCase()))
		);

		// console.log(categoryNames);

		// Check the message for matching category.
		let categoryOpt = null;
		const categoryNamesRegex = new RegExp(categoryNames.join('|'));
		const categoryMatches = categoryNamesRegex.exec(msg.content);
		if (categoryMatches) categoryOpt = categoryMatches[0];

		// TODO: Critical support needed for command/command group DETAIL.
		// console.log('categoryMatches', categoryMatches);

		// Check the message for matching command.
		let commandOpt = null
		const commandNamesRegex = new RegExp(commandNames.join('|'));
		const commandMatches = commandNamesRegex.exec(msg.content);
		if (commandMatches) commandOpt = commandMatches[0];

		// console.log('commandMatches', commandMatches);

        try {
			// TODO: Implement properly.

			if (!categoryOpt && !commandOpt) {
				let helpString = `**Available Commands**: \nTo find out more provide a command group or command name. !help {?CMD|GROUP?}\n\n`;
				this.commando.registry.groups.map(group => {
					if (hiddenGroups.includes(group.id)) return false;
					helpString += `**${group.name}:**\n`;

					let count = 0;
					const delimiter = group.commands.size > 1 ? ', ' : '.'; 
					group.commands.map((cmd) => {
						let finalSpacer = delimiter;

						if (count === group.commands.size - 1) finalSpacer = '.';

						if (hiddenGroups.includes(cmd.memberName)) return false;
						helpString += `!${cmd.memberName}${finalSpacer}`;

						count++;
					});
					helpString += '\n\n';
				});
	
				textSplitter(helpString, 1500).map((helpSection, index) => {
					setTimeout(() => msg.direct(helpSection), 1666 * index);
				});
			}

			if (commandOpt) {
				msg.direct('I should help you with the command... ' + commandOpt)
				
			} else if (categoryOpt) {
				msg.direct('I should help you with the category of commands you specified... ' + categoryOpt)
			}

        } catch(e) {
			console.log('Help error.')
			console.error(e);
            msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
}