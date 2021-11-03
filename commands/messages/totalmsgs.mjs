import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';

export const name = 'totalmsgs';

export const description = 'Check total messages';
    
export const examples = '!totalmsgs <user>';

export const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
  
	.addUserOption(option => 
		option
			.setName('target_user')
			.setDescription('Whose total messages are you trying to check?')
			.setRequired(false)
	);


export const execute = async (interaction) => {
	// Access the user.
	const targetUser = interaction.options.get('target_user').value ?? '';

	// Prevent @everyone from idiots using it.
	if (targetUser.includes('@everyone')) {
		return COOP.MESSAGES.selfDestruct(interaction.channel, 'Warning: @ everyone not allowed.', 0, 5000);
	}

  // Without any target
  if (!targetUser){
  targetUser = msg.author;
  }

  // Default status for last sacrifice date.
  let totalMsgs = 'unknown';

	// Load and format last sacrifice time.
  const userTotal = await COOP.USERS.getField(targetUser.id, 'total_msgs');
  if (userTotal) totalMsgs = userTotal;

  // Provide the result to the user.
  const msgText = `${targetUser.username}'s total message count: ${totalMsgs}.`;
  COOP.MESSAGES.selfDestruct(msg, msgText);

};