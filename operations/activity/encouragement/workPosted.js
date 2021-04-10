import CDNManager from "../../../origin/setup/cdn";

import COOP from "../../../origin/coop";

export default async function workPostHandler(msg) {
    // Ignore Cooper.
    if (msg.author.bot) return false;
    
    // Check if image.
    if (msg.attachments.size > 0) {
        try {
            // Encourage with reaction.
            await msg.react(COOP.CONFIG.EMOJIS.COOP);
    
            // Post link to work in feed
            const workLink = COOP.MESSAGES.link(msg);
            await COOP.CHANNELS._postToFeed(
                `${msg.author.username} just posted some work! View it here:\n ${workLink}`
            );
    
            msg.attachments.map(async (file) => {
                const annotationLines = msg.content.split('\n');
                const name = annotationLines[0] || 'Another The Coop Image!'

                // Remove the name now it is no longer needed.
                annotationLines.shift()

                const description = annotationLines.join('\n') + "\n\n" +
                    "Do you have Business/Art/Code interests? Join us! https://discord.gg/5cmN8uW"
                await CDNManager.upload(
                    file.url,
                    name,
                    description
                );
            });
        } catch(e) {
            console.error(e);
        }
    }
}