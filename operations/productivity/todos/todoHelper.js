import { CHANNELS, STATE } from "../../../origin/coop";

export default class TodoHelper {

    // Fine for being due, point for succeeding.
    static async checkDue() {
        const todos = await this.getAll();
        const currentSecs = Date.now() / 1000;
        const due = todos.filter(todo => todo.deadline <= currentSecs);
        due.map(todo => console.log('todo finished', todo));

        // Thank you Stocker for contributing this code.
        if (STATE.CHANCE.bool({ likelihood: 20 }))
            CHANNELS._send('TALK', 'Checking TODOs! ()');
    }

    static async getAll() {
        return [];
    }
}