import { USERS, MESSAGES, CHANNELS, TIME } from '../../../origin/coop';
import { RAW_EMOJIS, ROLES, CHANNELS as CHANNEL_CONFIG } from '../../../origin/config';

export default async (msg) => {
    try {
    if (msg.channel.id !== CHANNEL_CONFIG.INTRO.id) return false;

    // Ignore Cooper's messages.
    if (msg.author.bot) return false;

    // Access the full featured member object for the user.
    const memberSubject = USERS._getMemberByID(msg.author.id);

    // Check they haven't already posted an intro
    const userIntroData = await USERS.getIntro(memberSubject) || {};
    const retrievedIntroLink = userIntroData.intro_link || null;
    if (retrievedIntroLink) {
      const warningMsg = await msg.reply(
        `**You have already posted an intro**, only one introduction message allowed. \n\n` +
        `Deleting your message in 3 seconds, copy it if you want to preserve it.`
      );

      // Delete two messages. 
      MESSAGES.delayDelete(warningMsg, 3333);
      MESSAGES.delayDelete(msg, 3333 * 2);

    } else {
      // Add intro message link and time to intro
      const introLink = MESSAGES.link(msg);
      await USERS.setIntro(memberSubject, introLink, TIME._secs());

      // Send avatar + header embed (due to loading jitter issue)
      const username = memberSubject.user.username;

      // Post message in feed
      const introText = `${username} posted an introduction in ${CHANNELS.textRef('INTRO')}! 👋`;
      await CHANNELS._codes(['TALK'], introText);   
      
      // Send embed to approval channel for redeeming non-members via introduction.
      if (!USERS.hasRoleID(memberSubject, ROLES.MEMBER.id)) {
        await CHANNELS._postToChannelCode('ENTRY', MESSAGES.embed({
          url: MESSAGES.link(msg),
          title: `${username}'s entry is being voted upon!`,
          description: `Please read ${CHANNELS.textRef('INTRO')} and submit your vote! \n` +
            `_In ${CHANNELS.textRef('ENTRY')} you get the chance to talk to ${username} and get to know them more before voting._`,
          thumbnail: USERS.avatar(memberSubject.user)
        }));
      }

      // Add helpful emoji reaction suggestions to the message.
      MESSAGES.delayReact(msg, '👋', 333);
      MESSAGES.delayReact(msg, RAW_EMOJIS.VOTE_FOR, 666);
      MESSAGES.delayReact(msg, RAW_EMOJIS.VOTE_AGAINST, 999);
    }

  } catch(e) {
    console.error(e)
  }
}