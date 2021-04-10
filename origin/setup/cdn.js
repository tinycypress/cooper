import axios from 'axios';

const clientID = '4a7e3b1215db7f1';
const clientSecret = '7e3aca3ec854dcdcead25da190e26cc3a88e6756';

export default class CDNManager {

    static accessToken = process.env.IMGUR_ACCESS_TOKEN;
    static refreshToken =  process.env.IMGUR_REFRESH_TOKEN;

    static async start() {
        const config = {
            method: 'post',
            url: 'https://api.imgur.com/oauth2/token',
            data: {
                'refresh_token': this.refreshToken,
                'client_id': clientID,
                'client_secret': clientSecret,
                'grant_type': 'refresh_token'
            }
        };

        try {            
            const response = await axios(config);
            const { access_token, refresh_token } = response.data;

            this.accessToken = access_token;
            this.refreshToken = refresh_token;

        } catch(e) {
            console.error(e);
        }
    }

    static async share(imageData, title, description) {
        const config = {
            method: 'post',
            url: `https://api.imgur.com/3/gallery/image/${imageData.id}`,
            headers: { 
                'Authorization': `Bearer ${this.accessToken}`
            },
            data: {
                title: imageData.title,
                description: description,
                terms: 1
            }
        };

        try {            
            const response = await axios(config);

        } catch(e) {
            console.error(e);
        }
    }

    static async upload(url, title, description) {

        const config = {
            method: 'post',
            url: 'https://api.imgur.com/3/image',
            headers: { 
                'Authorization': `Bearer ${this.accessToken}`
            },
            data: {
                image: url,
                title,
                description
            }
        };

        try {            
            const response = await axios(config);
            let data = null;

            if (typeof response.data !== 'undefined' && typeof response.data.data !== 'undefined') {
                data = response.data.data;
                await this.share(data, title, description);
            }

        } catch(e) {
            console.error(e);
        }
    }
}
