// выносим логику в сервисы

const userService = require('../service/user-service')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')

class UserController {
  // работа с http составляющими
  async registration(req, res, next) {
    try {
      // получаем результат валидации
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()[0].msg))
      }
      // вытаскиваем email и пароль из тела запроса
      const { email, password } = req.body
      // вернется токен и инфа о пользователе
      const userData = await userService.registration(email, password)
      // сохраняем refreshToken в куках
      res.cookie('refreshToken', userData.refreshToken, {
        // будет жить 30 дней как и сам токен
        maxAge: 30 * 24 * 60 * 60 * 1000,
        // ВАЖНО!!! парметр для того, чтобы эту куку
        // нельзя было получать и изменять внутри браузера
        httpOnly: true,
        // только с https
        // secure: true,
      })
      // возвращаем на клиент
      return res.json(userData)
    } catch (e) {
      // вызывая next с ошибкой, мы попадаем в  middleware с ошибкой
      next(e)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch (e) {
      next(e)
    }
  }

  async activate(req, res, next) {
    try {
      // из строки запроса получаем ссылку активации
      // (указывали в пути роута как динамич. параметр)
      const activationLink = req.params.link
      await userService.activate(activationLink)
      // редирект на фронтенд
      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers()
      return res.json(users)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()
