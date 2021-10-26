import { USERS, MESSAGES, CHANNELS, TIME } from '../../../origin/coop.mjs';
import { RAW_EMOJIS, ROLES, CHANNELS as CHANNEL_CONFIG } from '../../../origin/config.mjs';

export default async (msg) => {
    try {
      if (msg.channel.id !== CHANNEL_CONFIG.INTRO.id) return false;

      // Ignore Cooper's messages.
      if (msg.author.bot) return false;

      // Access the full featured member object for the user.
      const memberSubject = USERS._getMemberByID(msg.author.id);

      // Check they haven't already posted an intro
      const savedUser = await USERS.loadSingle(memberSubject.user.id);

      // Add intro message link and time to intro if in the database.
      const introLink = MESSAGES.link(msg);
      
      // Add an intro link for a member without an existing intro.
      if (savedUser && !savedUser.intro_link)
        return await USERS.setIntro(memberSubject.user.id, msg.content, introLink, TIME._secs());

      // Prevent users from adding two intro_links.
      if (savedUser && savedUser.intro_link) {

        const warningText = `**You have already posted an intro**, only one introduction message allowed. \n\n` +
        `Deleting your message in 6 seconds, copy it if you want to preserve it.`;

        // Send warning.
        MESSAGES.silentSelfDestruct(msg, warningText, 0, 5000);

        // Delete the intro.
        MESSAGES.delayDelete(msg, 3333 * 2);

        return null;
      }

      // Send avatar + header embed (due to loading jitter issue)
      const username = memberSubject.user.username;

      // Send embed to approval channel for redeeming non-members via introduction.
      if (!USERS.hasRoleID(memberSubject, ROLES.MEMBER.id)) {
        // Post message in feed
        const introText = `${username} posted an introduction in ${CHANNELS.textRef('INTRO')}! 👋`;
        await CHANNELS._codes(['TALK'], introText);   
      
        await CHANNELS._postToChannelCode('ENTRY', MESSAGES.embed({
          url: MESSAGES.link(msg),
          title: `${username}'s entry is being voted upon!`,
          description: `Please read ${CHANNELS.textRef('INTRO')} and submit your vote! \n` +
            `_In ${CHANNELS.textRef('ENTRY')} you get the chance to talk to ${username} and get to know them more before voting._`,
          thumbnail: USERS.avatar(memberSubject.user)
        }));

        MESSAGES.delayReact(msg, RAW_EMOJIS.VOTE_FOR, 666);
        MESSAGES.delayReact(msg, RAW_EMOJIS.VOTE_AGAINST, 999);
      }

  } catch(e) {
    console.error(e)
  }
}
