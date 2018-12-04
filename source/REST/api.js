import { MAIN_URL, TOKEN } from './config';
export const api = {
    url:   MAIN_URL,
    token: TOKEN,

    async _updateTask (updateTask) {

        await fetch(MAIN_URL, {
            method:  "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify(updateTask),
        });
    },

    async fetchTasks () {
         const response = await fetch(MAIN_URL, {
            method:  "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
        });
        // console.log(await response.json());
        const { data: task } = await response.json();
        
        return task
    },

    

    // async _createTask (newMessage) {
    //     console.log(newMessage);
    //     const response = await fetch(MAIN_URL, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: TOKEN,
    //         },
    //         body: JSON.stringify({ message: newMessage }),
    //     });
    //     const { data: task } = await response.json();

    //     return task

    //     // this.setState(({ tasks }) => ({
    //     //     tasks: [task, ...tasks],
    //     //     isSpinning: false,
    //     // }));
    // },
}; 