import { ROLES } from '../../../origin/config';
import COOP from '../../../origin/coop';

export default class CommunityOpts {

    static projectsToggle(reaction, user) {
        COOP.ROLES.toggle(user.id, 'PROJECTS');
    }

    static miscToggle(reaction, user) {
        COOP.ROLES.toggle(user.id, 'MISC');
    }

}