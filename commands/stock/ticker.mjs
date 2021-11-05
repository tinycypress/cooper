import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import StockHelper from "../../operations/stock/stockHelper.mjs";

export const name = 'ticker';

export const description = 'Get stock ticker information';
    
export const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option => 
		option
			.setName('ticker')
			.setDescription('Stock ticker')
			.setRequired(true)
	)

export const execute = async (interaction) => {
	// Parse and normalise the ticker.
	let ticker = interaction.options.get('ticker').value ?? '';
	ticker = ticker.toUpperCase();

	// Load the alphavantage data for the ticker.
	const tickerData = await StockHelper.getAlpha(ticker);

	// Guard against the edge-case of no data found.
	if (!tickerData) 
		// Send the stock price data
		return await interaction.reply('Could not find that ticker! (' + ticker + ')');

	// Format the response.
	const responseText = `**${ticker} (${duration})**\n` +
		`Open: ${tickerData.price.open}\n` +
		`High: ${tickerData.price.high}\n` +
		`Low: ${tickerData.price.low}\n` +
		`Close: ${tickerData.price.close}\n\n` +
		`_Last refresh: ${tickerData.meta.last_refreshed}_`;

	// Send the stock price data
	await interaction.reply(responseText);
		
	// Generate the chart image.
	// cht=lc
	// chd=t:40,60,60,45,47,75,70,72

	// Follow up with a sample chart image.
	const chartImageURL = "https://image-charts.com/chart?ichm=8ddb1ec5ebcb42389a527872f2f1094e49c6b7785010ad644f5f73fdbb92d9ef&cht=bvs&icac=documentation&chd=s:theresadifferencebetweenknowingthepathandwalkingthepath&chf=b0,lg,90,03a9f4,0,3f51b5,1&chs=700x200&chxt=y&icretina=1&chof=.png";
	await interaction.followup(chartImageURL);

	return true;
};

// Ticker search
// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo