
import { Strategy } from 'passport-jwt';
import { USERS } from '../../origin/coop';
import jwt from 'jsonwebtoken';

const jwtFromRequest = function(req) {
    let token = null;

	// Detect, access, and parse token.
    if (req && req.headers.authorization) 
		token = req.headers.authorization.replace('Bearer ', '');

	console.log('getting token from req?', token);

    return token;
};

export default class Auth {

	static strategy() {
		const opts = {
			jwtFromRequest,
			secretOrKey: process.env.DISCORD_TOKEN,
			issuer: 'api.thecoop.group',
			audience: 'thecoop.group'
		};
		return new Strategy(opts, async function(jwt_payload, done) {
			console.log('trying to authenticate user with following payload:');
			console.log(jwt_payload);
			
			try {
				const user = await USERS.loadSingle(jwt_payload.sub.id);
				console.log(user);
				
				if (user) return done(null, user);
				else return done(null, false);

			} catch(e) {
				return done(err, false);
			}
		})
	}

	static token(user = { foo: 'bar', id: 'foo' }) {
		console.log('signing a token for', user);

		return jwt.sign(user, process.env.DISCORD_TOKEN);
	}
	
}