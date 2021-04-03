import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

// Work around due to Heroku hosting not seeming to like fs/promises import.
import { default as fsWithCallbacks } from 'fs';
import Path from 'path';

import { MessageAttachment } from 'discord.js';
const fs = fsWithCallbacks.promises

const isFolder = (path) => {
	if (path.includes('Procfile')) return false;
	if (path[path.length - 1] === '/') return true;
	if (!path.includes('.')) return true;

	return false;
}


export default class SourceCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'source',
			group: 'community',
			memberName: 'source',
			aliases: ['src'],
			description: 'Get the source of a file/folder/cooper.',
			details: ``,
			examples: ['source', 'source example'],
			args: [
				{
					key: 'filePath',
					prompt: 'Please provide the path you want sauce for:',
					type: 'string',
					default: './'
				}
			]
		});
	}

	static async getFileContent(path) {
		// Figure out project root.
		try {
			// Prevent access to secure data.
			if (path === '.env' || path === './.env') return null;

			// Load the file content.
			const file = await fs.readFile(path, "utf8");
			return file;

		} catch(e) {
			// Debugging only.
			// console.log(`'Error getting file: ${path}`);
			// console.log(e.message);
			// console.log(e.name);

			// console.error(e);

			return null;
		}
	}

	
	static async getFolderContent(path) {
		// Prevent loading node_modules... retarded.
		if (path === 'node_modules/' || path === './node_modules/')
			return null;

		try {
			// Load the file content.
			const folder = await fs.readdir(path, "utf8");

			// Sort by type, folders at top, files at bottom.
			folder.sort((a, b) => (isFolder(a) === isFolder(b)) ? 0 : isFolder(a) ? -1 : 1);

			return folder;

		} catch(e) {
			console.log(`'Error getting file: ${path}`);
			console.error(e);
			return null;
		}
	}

	async run(msg, { filePath }) {
		super.run(msg);

		try {
			const gitBaseUrl = `https://github.com/lmf-git/cooper/tree/master/`;

			// Calculate and output file source.
			// const path = path
			// 	.replace('!src ', '')
			// 	.replace('!source ', '').trim();

			// If intended path is a folder, show the files in that folder instead.
			if (isFolder(filePath)) {

				const rawFolderContent = await SourceCommand.getFolderContent(filePath);

				// Guard invalid path.
				if (!rawFolderContent) 
					return MessagesHelper.selfDestruct(msg, `Could not load the folder (${filePath}).`, 0, 5000);
	
				// Decide if it will fit in an embed or not.
				if (rawFolderContent.length > 0) {
					// Form the folder content feedback.
					const folderContent = `**Cooper's source (${filePath}):**\n` +
						`<${gitBaseUrl}${filePath.replace('./', '')}>\n\n` +

						// TODO: Add distance/breadcrumbs from root here.

						`-- :file_folder: ${filePath}\n` +
						`${rawFolderContent
							.filter(folderItem => folderItem.indexOf('node_modules') === -1)
							.filter(folderItem => folderItem.indexOf('@1') === -1)
							.filter(folderItem => folderItem.indexOf('.heroku') === -1)
							.filter(folderItem => folderItem.indexOf('package-lock') === -1)
							.filter(folderItem => folderItem.indexOf('.config') === -1)
							.filter(folderItem => folderItem.indexOf('.profile.d') === -1)
							.map(folderItem => {
								return `---- ${!isFolder(folderItem) ? ':minidisc:' : ':file_folder:'} ${folderItem}`
						}).join('\n')}`;

					// Output the display text lines of the folders.
					MessagesHelper.selfDestruct(msg, folderContent, 0, 10000);

				} else 
					MessagesHelper.selfDestruct(msg, `${filePath} is empty/invalid folder.`, 0, 10000);
				
			// File loading intended instead.
			} else {
				// Load the raw file source code.
				const rawFileContent = await SourceCommand.getFileContent(filePath);
	
				// Add file path comment to the top of the code.
				const fileContent = `// ${filePath}\n// ${gitBaseUrl}${filePath}\n\n`;
	
				// Guard invalid path.
				if (!rawFileContent) 
					return MessagesHelper.selfDestruct(msg, `Could not load the file for ${filePath}.`, 0, 10000);
	
				// TODO: Try to support returning documentation and syntax of a js class function.

				// Decide if it will fit in an embed or not.
				if (rawFileContent.length > 1000 - 20)
					MessagesHelper.selfDestruct(msg, fileContent.replace(gitBaseUrl + filePath, `<${gitBaseUrl + filePath}>`)
						+ `Source code too verbose (${rawFileContent.length}/980 chars), please view on Github.`, 0, 10000);
				else {

					// Code isn't too long, send the file!
					// msg.send(
					// 	"**!calc result for " + queryString + "**:", 
					// 	{ files: [Buffer.from(await result.buffer())] 
					// });

					console.log(filePath);

					const fileBuffer = Buffer.from(rawFileContent, 'utf-8');
					const fileNameExt = Path.basename(filePath);
					const attachment = new MessageAttachment(fileBuffer, fileNameExt);

					// Send the file.
					msg.channel.send('Source code file ' + filePath, attachment);

					// MessagesHelper.selfDestruct(msg, `\`\`\`js\n${fileContent + rawFileContent}\n\`\`\``, 0, 10000);
				}
			}


		} catch(e) {
			console.error(e);
		}
    }
    
};