import { Api } from './Api';

export const nutrients_api = new Api({
    baseURL: '/', // Запросы пойдут в корень, а Vite Proxy перекинет /api на бэкенд
    withCredentials: true, // ОЧЕНЬ ВАЖНО для передачи sessionId в куках
});