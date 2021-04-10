import Database from "../origin/setup/database";

export default class DatabaseHelper {

	static single(queryResult) {
		let singleResult = null;
		if (queryResult.rowCount > 0) singleResult = queryResult.rows[0];
		return singleResult;
	}

	static many(queryResult) {
		let manyResult = [];
		if (queryResult.rowCount > 0) manyResult = queryResult.rows;
		return manyResult;
	}

	static async singleQuery(query) {
		const queryResult = await Database.query(query);
		return DatabaseHelper.single(queryResult);
	}

	static async manyQuery(query) {
		const queryResult = await Database.query(query);
		return DatabaseHelper.many(queryResult);
	}

};