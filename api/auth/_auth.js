
import { Strategy } from 'passport-jwt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import axios from 'axios';

import { USERS } from '../../origin/coop';


export default class Auth {

	static jwtFromRequest = req => {
		let token = null;
	
		// Detect, access, and parse token.
		if (req && req.headers.authorization) 
			token = req.headers.authorization.replace('Bearer ', '');
	
		console.log('getting token from req?', token);
	
		return token;
	};

	static whoisMeViaDiscord = accessToken =>
		axios.get('https://discord.com/api/users/@me', {
			headers: { authorization: `Bearer ${accessToken}` }
		});

	static authorizeDiscord = (code) => 
		axios.post('https://discord.com/api/oauth2/token', 
			new URLSearchParams({
				client_id: process.env.DISCORD_APPID,
				client_secret: process.env.DISCORD_CLIENT_SECRET,
				code,
				grant_type: 'authorization_code',
				redirect_uri: `https://thecoop.group/auth/discord-oauth`,
				scope: 'identify'
			}),
			{ 
				headers: {  'Content-Type': 'application/x-www-form-urlencoded' }
			}
		);

	static guard() {
		return passport.authenticate('jwt', { session: false });
	}

	static strategy() {
		const opts = {
			jwtFromRequest: this.jwtFromRequest,
			secretOrKey: process.env.DISCORD_TOKEN,
			issuer: 'api.thecoop.group',
			audience: 'thecoop.group'
		};
		return new Strategy(opts, async (jwt_payload, done) => {
			console.log('trying to authenticate user with following payload:');
			console.log(jwt_payload);
			
			try {
				const user = await USERS.loadSingle(jwt_payload.id);
				console.log(user);
				
				if (!user) 
					throw new Error('Token does not represent a member of The Coop.');
				
				return done(null, user);

			} catch(e) {
				return done(e, false);
			}
		});
	}

	static token(user = { foo: 'bar', id: 'foo' }) {
		console.log('signing a token for', user);

		return jwt.sign(user, process.env.DISCORD_TOKEN, {
			issuer: 'api.thecoop.group',
			audience: 'thecoop.group'
		});
	}
	
}