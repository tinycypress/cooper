import COOP, { USERS } from "../../../origin/coop";


export default class AnnouncementOpts {

    
    static newsletterToggle() {
        // console.log('newsletterToggle', reaction.message.id, user.username);
        // return 1;

        // Prompt user to give email in Cooper DM to get the role

        // If turn off, delete email.
    }

    static announcementSubToggle(reaction, user) {
        COOP.ROLES.toggle(user.id, 'SUBSCRIBER');
    }

    static privacyBomb(reaction, user) {
        // COOP.USERS._dm(user.id, `Are you sure you want to delete ALL data? (WIP)`);

        // console.log('privacyBomb', reaction.message.id, user.username);

        setTimeout(() => USERS._dm(user.id, 'Deleting all of your data and kicking you in 3...'), 1000);
        setTimeout(() => USERS._dm(user.id, 'Deleting all of your data and kicking you in 2...'), 2000);
        setTimeout(() => USERS._dm(user.id, 'Deleting all of your data and kicking you in 1...'), 3000);
        setTimeout(() => USERS._dm(user.id, 'Just kidding lol.'), 4000);
    }
    
}