// мы наем,что после логина регистрации и refresha
// нам возвращается объект у которого есть три поля:
// укажим тип
// и также нам приходит userDto

import {IUser} from "../IUser";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    // это не примитив и для него мы создадим отдельный interface IUser.ts
    user: IUser;
}
