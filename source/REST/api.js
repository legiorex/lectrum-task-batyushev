import { MAIN_URL, TOKEN} from './config';
export const api = {
   async fetchTask() {
        const response = await fetch(MAIN_URL, {method: 'GET', headers: {
            authorization: TOKEN
        }})
    }
};
