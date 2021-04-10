// Response to redemption offer accepted.
try {
    if (msg.channel.type !== 'dm') await msg.reply('Redeeeeeeeeeeeeemed.');
    await msg.direct(
        'You have been approved for The Coop, and now have full access as a member! \n' +
        'Consider getting "themob" and "are-very-social" roles for community insider info!'
    );
    
} catch(err) {
    console.error('Unable to send user approval DM.')
}