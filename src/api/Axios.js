import axios from 'axios';

// let token = localStorage.getItem('token')

export let axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/',
    // headers: {
    //     Authorization: token
    // }
});

// token.delete() если сервер ответит 401 ошибкой
// настроенный аксиос

// в хедеры с локал сторедж добавишь jwt token
// и тут выгружаешь аксиос настроенный

