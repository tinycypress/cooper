import COOP from '../../../origin/coop';

export default async function memberJoined(member) {

  try {
    const welcomeMessage = await COOP.CHANNELS._postToChannelCode('ENTRY', 
      `**Welcome, <@${member.user.id}> to The Coop**, I am Cooper.` +
      ` We are an referral/invite only community, please introduce yourself. ${COOP.CHANNELS.textRef('INTRO')}`
    ); 

    // Send direct message and channel message about next steps.
    await member.send(
      'Welcome to The Coop! View your welcome message and next steps here: ' + 
      COOP.MESSAGES.link(welcomeMessage));

    // Notify community:
    COOP.CHANNELS._codes(['FEED', 'TALK'], `**Someone new joined "${member.user.username}": ${COOP.CHANNELS.textRef('ENTRY')}!**`);

  } catch(e) {
    console.error(e)
  }
}