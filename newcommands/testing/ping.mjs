export const name = 'ping';

export const description = 'The ping command!';
    
export const execute = async (interaction) => {
    console.log('Ping executing');
    await interaction.reply('Pong!');
};