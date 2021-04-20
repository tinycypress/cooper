import { CHANNELS, MESSAGES, SERVER, STATE } from "../../../origin/coop";
import Database from "../../../origin/setup/database";
import DatabaseHelper from "../../databaseHelper";

export default class TodoHelper {

    // Fine for being due, point for succeeding.
    static async checkDue() {       
        // Thank you Stocker for contributing this code.
        if (STATE.CHANCE.bool({ likelihood: 10 })) {
            const todos = await this.getAll();
            const currentSecs = Date.now() / 1000;
            const due = todos.filter(todo => todo.deadline <= currentSecs);
    
            let dueText = `📝 **TODOs**\n\n` +
                `Due Now: ${due.length}\n` +
                `Ongoing: ${todos.length - due.length}\n` +
                `Total: ${todos.length}\n` +
    
                `\n_Tip: Type and send !todo to create your todo task!_`;

            CHANNELS._tempSend('TALK', dueText, 333, 60000);
        }
    }

    static getAll() {
        return DatabaseHelper.manyQuery({
            name: 'get-all-todos',
            text: `SELECT * FROM todos`
        });
    }

    static getUserTodos(userID, category = 'all') {
        // If category is all, just return all... this will cause some missing.
        return DatabaseHelper.manyQuery({
            name: category === 'all' ? 'get-user-todos' : 'get-user-todos-category',
            text: `SELECT * FROM todos WHERE user_id = $1 ${category === 'all' ? '' : 'AND category = $2'}`,
            values: category === 'all' ? [userID] : [userID, category]
        });
    }

    static get(todoID) {
        return DatabaseHelper.singleQuery({
            name: `get-todo`,
            text: `SELECT * FROM todos WHERE id = $1`,
            values: [todoID]
        });
    }

    static async remove(todoID) {
        const result = await Database.query({
            name: `remove-todo`,
            text: `DELETE FROM todos WHERE id = $1`,
            values: [todoID]
        });
        const successDelete = result.rowCount === 1;
        return successDelete;
    }

    static async add(userID, todo) {
        try {  
            return await Database.query({
                name: `add-user-todo`,
                text: `INSERT INTO todos(user_id, title, category, due)
                    VALUES($1, $2, $3, $4)`,
                values: [userID, todo.title, todo.category, todo.due]
            });
        } catch(e) {
            if (e.constraint === 'unique_title')
                return 'ALREADY_EXISTS';
                
            console.log('Error adding todo.')
            console.error(e);
            return false
        }
    }

    static async modifyDeadline(todoID, secs) {

    }

    // TODO: meh
    static async punish() {}
    static async reward() {}
}