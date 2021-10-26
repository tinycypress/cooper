import { USERS, CHANNELS, SERVER, STATE } from '../../../origin/coop.mjs';


export default async function memberLeft(member) {

  try {
    const server = SERVER.getByCode(STATE.CLIENT, 'PROD');
    await CHANNELS
      .getByCode(server, 'FEED')
      .send(`${member.user.username} has flown the coop. F for ${member.user.username}`); 

    // Remove from database and cascade all other entries (optimisation)
    await USERS.removeFromDatabase(member);

    // TODO: Post in leaders channel.

  } catch(e) {
    console.error(e)
  }
}