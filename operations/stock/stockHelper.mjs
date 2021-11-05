
export default class StockHelper {

    static async getAlpha(ticker) {
        let tickerData = null;

        try {
            // Stock make Ticker work.
            const base = `https://www.alphavantage.co/query?`;
    
            // Provide a dropdown select for this?
            const duration = '5min';
    
            const params = [
                'function=TIME_SERIES_INTRADAY',
                'symbol=' + ticker,
                'interval=' + duration,
                `apikey=${process.env.ALPHA_VANTAGE_KEY}`
            ];
    
            const resp = await axios.get(base + params.join('&'));
    
            if (resp) {
                const data = resp.data;
        
                // TODO: Need to handle unrecognised.
        
                tickerData = {
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
                            open: Math.round(latestPrice['1. open']),
                            high: Math.round(latestPrice['2. high']),
                            low: Math.round(latestPrice['3. low']),
                            close: Math.round(latestPrice['4. close']),
                            volume: Math.round(latestPrice['5. volume'])
                        };
                    }
                });
            }
            
        } catch(e) {
            console.log('Error getting stock ticker data ' + ticker);
            console.error(e);
        }

        return tickerData;
    }
}