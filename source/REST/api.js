import { MAIN_URL, TOKEN } from './config';
export const api = {

    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method:  "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
        });

        const { data: task } = await response.json();

        return task;
    },
    async createTask (newMessage) {

        const response = await fetch(MAIN_URL, {
            method:  "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message: newMessage }),
        });
        const { data: task } = await response.json();

        return task;
    },

    async removeTask (id) {

        await fetch(`${MAIN_URL}/${id}`, {
            method:  "DELETE",
            headers: {
                Authorization: TOKEN,
            },
        });
    },
    async updateTask (updateTask) {

        await fetch(MAIN_URL, {
            method:  "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify(updateTask),
        });
    },

};
