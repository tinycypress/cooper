import { EMOJIS } from '../../../origin/config';
import { CHANNELS, MESSAGES } from '../../../origin/coop';

export default async function memberJoined(member) {

  try {
    // Send direct message and channel message about next steps.
    const dmWelcomeMessage = await member.send(
      `Welcome to **The Coop!** Please introduce yourself in ${CHANNELS.textRef('INTRO')} so the community can fully approve you into the server :smile:!`
    );

    // TODO: Should ask them to follow our social

    // Add some nice emojis to dm welcome message.
    MESSAGES.delayReact(dmWelcomeMessage, EMOJIS.COOP, 333);
    MESSAGES.delayReact(dmWelcomeMessage, '👋', 666);

    // Notify community:
    const joinAnnouncementText = `**Someone new joined "${member.user.username}": ${CHANNELS.textRef('ENTRY')}!**`;
    CHANNELS._codes(['TALK'], joinAnnouncementText);

    // Add the welcome to the channel dedicated to people joining!
    CHANNELS._codes(['WELCOME'], `**${member.user.username}** has flown into The Coop!`);

    const coop = MESSAGES.emojiText(EMOJIS.COOP);
    const welcomeMessage = await CHANNELS._postToChannelCode('ENTRY', 
      `Hey <@${member.user.id}>! Please introduce yourself in ${CHANNELS.textRef('INTRO')} so the community can fully approve you into the server :smile:!\n` +
      `Be aware that you can only send one ${CHANNELS.textRef('INTRO')} message - make it good!` +
      `Here in ${CHANNELS.textRef('ENTRY')} you get the chance to talk to the community while waiting to get accepted :D! `
    );
    
    // React with coop emoji... because.
    MESSAGES.delayReact(welcomeMessage, EMOJIS.COOP, 333);
    MESSAGES.delayReact(welcomeMessage, '👋', 666);

  } catch(e) {
    console.error(e)
  }
}