import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { USERS } from '../../origin/coop';
import jwt from 'jsonwebtoken';


const temporaryEncryptionKey = 'sssssssssshhhshshshshsh';

export default class Auth {

	static guard() {
		return passport.authenticate('jwt', { session: false });
	}

	static strategy() {
		const opts = {
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: temporaryEncryptionKey,
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
		return jwt.sign(user, temporaryEncryptionKey);
	}
	
}