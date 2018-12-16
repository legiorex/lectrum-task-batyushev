import { MAIN_URL, TOKEN } from "./config";
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
        const arrayTask = [];

        arrayTask.push(updateTask);
        const response = await fetch(MAIN_URL, {
            method:  "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify(arrayTask),
        });
        const { data: task } = await response.json();

        return task;
    },

    async completeAllTasks (tasks) {
        const promises = [];

        for (const task of tasks) {
            promises.push(
                fetch(MAIN_URL, {
                    method:  "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:  TOKEN,
                    },
                    body: JSON.stringify([{ ...task, completed: true }]),
                })
            );
        }

        await Promise.all(promises);
        // const responses = await Promise.all(promises);

        // const success = responses.every((result) => result.status === 200);

        // if (!success) {
        //     throw new Error('Tasks were not completed');
        // }
    },
};
