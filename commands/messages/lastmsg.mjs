import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP, { TIME } from '../../origin/coop.mjs';

export const name = 'lastmsg';

export const description = 'Check last message';
    
export const examples = '!lastmsg <user>';

export const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
  
	.addUserOption(option => 
		option
			.setName('target_user')
			.setDescription('Whose last message are you trying to check?')
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
  let lastMsgFmt = 'unknown';

  // Load and format last sacrifice time.
  const lastMsgSecs = await COOP.USERS.getField(targetUser.id, 'last_msg_secs')
  if (lastMsgSecs) lastMsgFmt = TIME.secsLongFmt(lastMsgSecs);
  
  // Provide the result to the user.
  const msgText = `${targetUser.username}'s last message was: ${lastMsgFmt}.`;
  COOP.MESSAGES.selfDestruct(msg, msgText);
  };

