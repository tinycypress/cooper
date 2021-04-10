// import { ROLES } from '../../../origin/config';
import COOP from '../../../origin/coop';

export default class GameOpts {

    static economyToggle(reaction, user) {
        COOP.ROLES.toggle(user.id, 'ECONOMY');
    }

    static conquestToggle(reaction, user) {
        COOP.ROLES.toggle(user.id, 'CONQUEST');
    }

}