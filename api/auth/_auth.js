import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { USERS } from '../../origin/coop';
import jwt from 'jsonwebtoken';

const jwtFromRequest = function(req) {
	console.log('gettting token');
	console.log(req);
	console.log('gettting token');

	console.log(req.headers.get('Authorization'));
	console.log(req.headers.get('authorization'));

    var token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
};

export default class Auth {

	static guard() {
		return passport.authenticate('jwt', { session: false });
	}

	static strategy() {
		const opts = {
			jwtFromRequest,
			secretOrKey: process.env.DISCORD_TOKEN,
			issuer: 'api.thecoop.group',
			audience: 'thecoop.group'
		};
		return new Strategy(opts, async (jwt_payload, done) => {
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
		return jwt.sign(user, process.env.DISCORD_TOKEN);
	}
	
}