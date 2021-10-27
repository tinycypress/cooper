import { SlashCommandBuilder } from "@discordjs/builders";
import { USERS } from '../../origin/coop.mjs';
import TempAccessCodeHelper from '../../operations/members/tempAccessCodeHelper.mjs';

export const name = 'login';

export const description = 'Conveniently login to The Coop website';
    
export const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description);

export const execute = async (interaction) => {
	// Generate a saved code the web api to authenticate on link visit.
	const code = await TempAccessCodeHelper.create(interaction.member.id);

	// DM the login code to the user
	USERS._dm(interaction.member.id, 
		`**Your temporary login code (expiring link) is here, use it within the next 5 minutes:**\n\n` +
		'https://thecoop.group/auth/authorise?method=cooper_dm&code=' + code
	);

	// Also a way to ensure that most codes are deleted in a more timely manner and
	// also don't require a super fast setInterval =]
	// TODO: Enhancement When it expires check if it was used/deleted - if not warn them (via editing the msg...?)
	// setTimeout(() => {

	// }, TempAccessCodeHelper.expiry + 1000);
};

