import { EMOJIS } from '../../../origin/config';
import { CHANNELS, MESSAGES } from '../../../origin/coop';

export default async function memberJoined(member) {

  try {
    
    const coop = MESSAGES.emojiText('COOP');
    const welcomeMessage = await CHANNELS._postToChannelCode('ENTRY', 
      `Hey <@${member.user.id}>, welcome to **The Coop** ${coop}.` +
      ` We are an referral/invite only community, **__please introduce yourself .__** ${CHANNELS.textRef('INTRO')}`
    );

    // React with coop emoji... because.
    MESSAGES.delayReact(welcomeMessage, EMOJIS.COOP, 333);
    MESSAGES.delayReact(welcomeMessage, '👋', 666);

    // Send direct message and channel message about next steps.
    const dmWelcomeMessage = await member.send(
      'Welcome to The Coop! View your welcome message and next steps here: ' + 
      MESSAGES.link(welcomeMessage)
    );

    // Add some nice emojis to dm welcome message.
    MESSAGES.delayReact(dmWelcomeMessage, EMOJIS.COOP, 333);
    MESSAGES.delayReact(dmWelcomeMessage, '👋', 666);

    // Notify community:
    const joinAnnouncementText = `**Someone new joined "${member.user.username}": ${CHANNELS.textRef('ENTRY')}!**`;
    CHANNELS._codes(['TALK', 'WELCOME'], joinAnnouncementText);

  } catch(e) {
    console.error(e)
  }
}