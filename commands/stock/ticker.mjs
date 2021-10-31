import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";

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
	let ticker = interaction.options.get('ticker').value ?? '';

	ticker = ticker.toUpperCase();

	// Stock make Ticker work.
	const base = `https://www.alphavantage.co/query?`;

	// Provide a dropdown select for this?
	const duration = '5min';

	const params = [
		'function=TIME_SERIES_INTRADAY',
		'symbol=' + 'BB',
		'interval=' + duration,
		`apikey=${process.env.ALPHA_VANTAGE_KEY}`
	]

	const resp = await axios.get(base + params.join('&'));

	const data = resp.data;

	// TODO: Need to handle unrecognised.

	const tickerData = {
		meta: {},
		price: {}
	};

	Object.keys(data).map(key => {
		if (key === 'Meta Data') 
			tickerData.meta = {
				information: data[key]['1. Information'],
				symbol: data[key]['2. Symbol'],
				last_refreshed: data[key]['3. Last Refreshed'],
				interval: data[key]['4. Interval'],
				output_size: data[key]['5. Output Size'],
				time_zone: data[key]['6. Time Zone']
			}
		else {
			const priceKeys = Object.keys(data[key]);
			const latestPrice = data[key][priceKeys[0]];
			tickerData.price = {
				open: latestPrice['1. open'],
				high: latestPrice['2. high'],
				low: latestPrice['3. low'],
				close: latestPrice['4. close'],
				volume: latestPrice['5. volume']
			};
		}
	});

	// Format the response.
	const responseText = `**${ticker} ${duration}**\n` +
		`Open: ${tickerData.open}\n` +
		`High: ${tickerData.high}\n` +
		`Low: ${tickerData.low}\n` +
		`Close: ${tickerData.close}\n\n` +
		`_Last refresh: ${tickerData.last_refreshed}_`;

	// Ticker search
	// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo

	return await interaction.reply(responseText);
};

