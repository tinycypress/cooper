import Database from "../../../../origin/setup/database";
import DatabaseHelper from "../../../databaseHelper";

export default class BaseHelper {

    static async all() {
        const query = {
            name: "get-all-bases",
            text: "SELECT * FROM bases"
        };
        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }

    static async get(faceID) {
        const query = {
            name: "get-all-bases",
            text: "SELECT * FROM bases WHERE face_id = $1",
            values: [faceID]
        };
        const result = await Database.query(query);
        return DatabaseHelper.single(result);
    }

}