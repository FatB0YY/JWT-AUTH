// ф-ции запроса на сервер

import $api from "../http";
// axios всегда возращает объект
// данные, которые мы получили в теле ответа, хранятся в поле data
// и для того, чтобы указать тип этот данных, нам нужен тип
// который мы импортируем из axios это AxiosResponse
import {AxiosResponse} from 'axios';

// те мы сделали axios.post нам прилетело res.data и нам необходимо знать
// какие данные придут, мы должны явно указать.
// для этого создадим models -> response -> AuthRes.ts
import {AuthResponse} from "../models/response/AuthResponse";

// статик ф-ции с помощью которых будем отправлять запросы на сервер
export default class AuthService {
    // тк ф-ция async, она всегда будет возвращать Promise
    // мы четко знаем что эта ф-ция будет возвращать
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        // первый пар - адрес эндпоинта
        // второй - тело запроса
        return $api.post<AuthResponse>('/login', {email, password})
    }

    static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/registration', {email, password})
    }

    static async logout(): Promise<void> {
        return $api.post('/logout')
    }

    // в семантику сервиса авторизации ф-ция получения пользователей
    // не подходит, поэтому UserService.ts
}

