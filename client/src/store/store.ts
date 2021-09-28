// глобальное хранилище

import { IUser } from '../models/IUser'
import { makeAutoObservable } from 'mobx'
import AuthService from '../services/AuthService'
import axios from 'axios'
import { AuthResponse } from '../models/response/AuthResponse'
import { API_URL } from '../http'

export default class Store {
  // поле юзер, в которое мы будем сохранять данные пользователя
  user = {} as IUser
  // если не авториз тогда false
  isAuth = false
  isLoading = false

  // для того чтобы mobx с этим классом мог работать
  constructor() {
    makeAutoObservable(this)
  }

  // мутации, измешяющие поля стора
  setAuth(bool: boolean) {
    this.isAuth = bool
  }

  setUser(user: IUser) {
    this.user = user
  }

  setLoading(bool: boolean) {
    this.isLoading = bool
  }

  async login(email: string, password: string) {
    try {
      // если все прошло успешно, то в ответе бдут находиться токены
      const response = await AuthService.login(email, password)
      console.log(response)
      // сохраняем токен доступа
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (e) {
      console.log(e.response?.data?.message)
    }
  }

  async registration(email: string, password: string) {
    try {
      const response = await AuthService.registration(email, password)
      console.log(response)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (e) {
      console.log(e.response?.data?.message)
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout()
      localStorage.removeItem('token')
      this.setAuth(false)
      // пустой объект тип юзер    
      this.setUser({} as IUser)
    } catch (e) {
      console.log(e.response?.data?.message)
    }
  }

  // проверка авторизации
  async checkAuth() {
    this.setLoading(true)
    try {
      // воспульзуемся дефолнтным инстансом axios
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
        withCredentials: true,
      })
      console.log(response)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (e) {
      console.log(e.response?.data?.message)
    } finally {
      this.setLoading(false)
    }
  }
}
