// import { ROLES } from '../../../origin/config';
import COOP from '../../../origin/coop.mjs';

export default class GameOpts {

    static logsToggle(reaction, user) {
        COOP.ROLES.toggle(user.id, 'LOGS');
    }

    static conquestToggle(reaction, user) {
        COOP.ROLES.toggle(user.id, 'CONQUEST');
    }

}