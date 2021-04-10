import COOP from "../../../origin/coop";


export default class AnnouncementOpts {

    static keyInfoToggle(reaction, user) {
        COOP.ROLES.toggle(user.id, 'KEY_INFO');
    }
    
    static newsletterToggle(reaction, user) {
        // console.log('newsletterToggle', reaction.message.id, user.username);
        // return 1;

        // Prompt user to give email in Cooper DM to get the role

        // If turn off, delete email.
    }

    static announcementSubToggle(reaction, user) {
        COOP.ROLES.toggle(user.id, 'SUBSCRIBER');
    }

    static privacyBomb(reaction, user) {
        COOP.USERS._dm(user.id, `Are you sure you want to delete ALL data? (WIP)`);

        console.log('privacyBomb', reaction.message.id, user.username);
        return 1;
    }
    
}