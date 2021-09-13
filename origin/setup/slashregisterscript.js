import axios from 'axios';

export default function RegisterSlashCommand(commandName, commandDesc, commandType = 1, commandOpts = []) {    
    return axios.post("https://discord.com/api/v8/applications/" + process.env.DISCORD_APPID + "/commands", 
        {
            "name": commandName,
            // # This is an example CHAT_INPUT or Slash Command, with a type of 1
            "type": commandType,
            "description": commandDesc,
            "options": commandOpts
        },
        // # For authorization, you can use either your bot token
        // # or a client credentials token for your app with the applications.commands.update scope
        {
            headers: {
                "Authorization": "Bot " + process.env.DISCORD_TOKEN
            }
        }
    );
}