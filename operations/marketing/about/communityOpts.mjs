import COOP from '../../../origin/coop.mjs';

export default class CommunityOpts {

    static projectsToggle(reaction, user) {
        COOP.ROLES.toggle(user.id, 'PROJECTS');
    }

    static miscToggle(reaction, user) {
        COOP.ROLES.toggle(user.id, 'MISC');
    }

}