// настройка axios

import axios from 'axios'
import { AuthResponse } from '../models/response/AuthResponse'
import { store } from '../index'
import { IUser } from '../models/IUser'

export const API_URL = `http://localhost:5000/api`

const $api = axios.create({
  // чтобы к каждому запросу автоматически цеплялись куки
  withCredentials: true,
  // базовый url
  baseURL: API_URL,
})

// на запрос
$api.interceptors.request.use((config) => {
  // присваиваем Bearer + токен
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})

// если пришел 401 статус
$api.interceptors.response.use(
  // если запрос прошел успешно
  (config) => {
    return config
  },
  // если нет
  async (error) => {
    // нам надо повторить исходный запрос
    const originalRequest = error.config
    // проверяем статус код который вернулся
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      // запрос уже делали
      originalRequest._isRetry = true
      try {
        // запрос на эндпоинт с refresh токенами
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        })
        localStorage.setItem('token', response.data.accessToken)
        // originalRequest все данные для запроса
        return $api.request(originalRequest)
      } catch (e) {
        console.log('НЕ АВТОРИЗОВАН')
      }
    } 
    // пробрасываем на верхний уровень
    throw error
  }
)

export default $api

/* interceptors
---------------
с помощью axios мы можем сделать некий запрос и получить ответ от сервера.
на отправку req и res мы можем повесить interceptors, перехватчик.
это обычная ф-ция, которая будет выполняться на каждый запрос и ответ.
---------------
interceptor который повесим на запрос, будет устанавливать headers
Authorization и помещать туда наш токен, нужно для того, чтобы мы этот хедер
не цепляли каждый раз в ручную.
---------------
interceptor который повесим на получение ответа от сервера.
Мы получили ответ, если статус код 200, то мы пропускаем,
если получили 401 (не авторизован), когда умер токен доступа (аксес токен),
аксес умирает каждые 15 минут, но refresh токен живет 30 дней,
и также есть эндпоинт который по наличию refresh токена перезаписывает
аксес токен м возвращает нам новую пару.
Нам нужно отправить refresh токен на этот эндпоинт,
и если все норм, сервер вернет новую пару, аксес токен мы опять сохраняем 
на клиенте, повторяем исходный запрос но уже с обнов токеном.
*/
