import { Client } from 'discord.js-commando';
import dotenv from 'dotenv';

import Database from './database';

import COOP, { CHANNELS, ITEMS, MESSAGES, SERVER, TIME, USERS } from '../coop';

import EventsHelper from '../../operations/eventsHelper';

import { status } from '../../operations/marketing/rewards/loyalty';
import client from './client';

// Commonly useful.
// const listenReactions = (fn) => COOP.STATE.CLIENT.on('messageReactionAdd', fn);
const listenMessages = (fn) => COOP.STATE.CLIENT.on('message', fn);


// v DEV IMPORT AREA v

// ^ DEV IMPORT AREA ^

// Load ENV variables.
dotenv.config();


const shallowBot = async () => {
    // Instantiate a CommandoJS "client".
    COOP.STATE.CLIENT = new Client({ owner: '786671654721683517' });

    // Connect to Postgres database.
    await Database.connect();
    
    // Login, then wait for the bot to be fully online before testing.
    await COOP.STATE.CLIENT.login(process.env.DISCORD_TOKEN);
    COOP.STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');
        // DEV WORK AND TESTING ON THE LINES BELOW.
        
        //big test
        
		// TODO: ADD STATISTICS + SATISFACTION FEEDBACK FOR HELP
		let message = 'flip'
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
		const categoryNames = client().registry.groups
			.filter(group => !hiddenGroups.includes(group.id))
			.map(group => group.id.toLowerCase());

		// Store command names to detect matches and provide helpful/detailed feedback.
		const commandNames = [];
		client().registry.commands.filter(cmd => !hiddenCommands.includes(cmd.memberName))
		.map(cmd => commandNames.push(cmd.memberName.toLowerCase()));

		// Check if message matches a category name and check that the message is not only a part of the category name.
		let categoryName = null;
		const categoryNamesRegex = new RegExp(categoryNames.join('|'), 'g');
        const categoryMatches = categoryNamesRegex.exec(message);
        if(categoryMatches) {
			categoryName =  categoryMatches.filter(categoryName => categoryName === message).toString();
        }
		// Check if message matches a command name and check that the command name doesn't only contain the message
		let commandName = null
		const commandNamesRegex = new RegExp(commandNames.join('|'), 'g');
        const commandMatch = commandNamesRegex.exec(message);
        if(commandMatch) {
			commandName =  commandMatch.filter(commandName => commandName === message).toString();
        }

		// console.log('commandMatches', commandMatches);

        try {
			// TODO: Implement properly.

			if (!categoryName && !commandName) {
				const groupsText = `**Available Command Groups**:\n\n` +
					client().registry.groups
					.filter(group => !hiddenGroups.includes(group.id))
					.map((group, index) => {
						return index === 0 ? group.name : group.name.toLowerCase();
					}).join(', ') + 
					`.\n\n_To find out more about a command group type and send: !help <group_name>_`;
	
				console.log(groupsText);
			}

			if (commandName) {
				let command = client().registry.commands.get(commandName);
				const commandHelpText = 
				`
				**${commandName} specifics:**\n\n
				name: ${command.name}
				group: ${command.groupID}
				description: ${command.description}
				`

				console.log(commandHelpText);
				
			} else if (categoryName) {
                let category = client().registry.groups.get(categoryName);
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
		console.log(client().registry.groups.get('conquest'))
        // Help command stub

        // EventsHelper.runInterval(status, 2000);

        // Structures
        // 100dz integration TODOs
        // Paypal in/out
                
        
        
        // TDOs less spammy
        // Fix items single check

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();