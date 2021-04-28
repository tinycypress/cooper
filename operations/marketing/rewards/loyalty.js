import { CHANCE, CHANNELS, USERS } from '../../../origin/coop';

export function status() {
    const getCustomStatus = user => 
        user.presence.activities.find(a => a.type === 'CUSTOM_STATUS');

    const eligbleMembers = USERS._cache().filter(member => {
        let hasLoyaltyText = false;

        // Could have a multiplier based on status
        // const status = member.presence.status;

        const customStatus = getCustomStatus(member);
        if (customStatus && (customStatus.state || customStatus.emoji)) {
            const customStatusText = customStatus.state;

            // Check the status text.
            if (customStatusText && customStatusText.includes('🥚')) 
                hasLoyaltyText = true;

            // Check in the emoji field too
            if (customStatus.emoji) {
                if (customStatus.emoji.name === '🥚') 
                    hasLoyaltyText = true;
            }
        }

        // Check if contains a raw egg emoji or a custom egg hunt emoji.

        return hasLoyaltyText;
    });

    // Attempt to award the members, pickset.
    const eligibleMembersFmt = eligbleMembers.map(member => {
        const customStatus = getCustomStatus(member);
        // console.log(member.user.username, customStatus);

        let emoji = null;

        // Check the status text.
        if (customStatus.state && customStatus.state.includes('🥚')) 
            emoji = '🥚';

        // Check in the emoji field too
        if (customStatus.emoji && customStatus.emoji.name === '🥚') 
            emoji = '🥚';

        return {
            user: member.user,
            text: customStatus.state,
            emoji
        };
    });

    // TODO: Make this variable and based on community velocity.
    const numWinners = 2;

    // Post elgible members with draw result.
    const loyaltyCheckText = `**Rewarding status loyalty!**\n\n` +
        `Eligble:\n` + eligibleMembersFmt.map(e => `<@${e.user.id}>`).join(', ') + '.\n\n' +
        `Winners:\n` + CHANCE.pickset(eligibleMembersFmt, numWinners).map(e => 
            `<@${e.user.id}>${e.text ? ` (${e.text})` : ''}`
        ).join(', ') + '.\n\n' +
        `_Add an egg emoji 🥚 or Coop egghunt emoji to your status to be rewarded._`;

    CHANNELS._send('TALK', loyaltyCheckText);
};