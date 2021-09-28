// логика для работы с пользователями
// ну грубо говоря бизнес-логика
// создание, удаление, добавление, поиск итд

const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
  // логика регистрации
  async registration(email, password) {
    // проверка на совпадение email
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      // ошибка будет обрабатываться уже в контролерре
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      )
    }

    // хэшируем пароль
    const hashPassword = await bcrypt.hash(password, 10)

    // генерация ссылки для активации
    const activationLink = uuid.uuidv4() // v34fa-asfasf-142saf-sa-asf

    // сохраняем в бд
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    })

    // отправка письма для активации почты
    // формируем ссылку
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    )

    // генерируем access и refresh токены
    // параметром мы должны передать payload,
    // но мы не должны помещать туда пароль и другую инфу
    // генерируем dto, будет обладать тремя полями
    const userDto = new UserDto(user) // -> id, email, isActivated
    // на вход ожидает обычный объект, а не инстанс класса
    // так что мы просто разворачиваем его
    const tokens = tokenService.generateTokens({ ...userDto })
    // сохраняем в бд
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    // возвращаем объект с токенами
    // и dto (инфа о пользователе)
    return { ...tokens, user: userDto }
  }

  async activate(activationLink) {
    // ищем юзера по этой ссылке
    const user = await UserModel.findOne({ activationLink })
    if (!user) {
      // выбрасываем к контроллер
      throw ApiError.BadRequest('Неккоректная ссылка активации')
    }
    // сохраняем на обновленного юзар в бд
    user.isActivated = true
    await user.save()
  }

  async login(email, password) {
    // проверяем есть ли пользователь уже
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не найден')
    }

    // хэшируем и сверяем пароли
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль мазафака')
    }

    // все то же самое
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

  async logout(refreshToken) {
    // удаляем токен из бд
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    // проверка на налл или андрфнд
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }

    // валидация токена, что он не подделан и что срок годности норм
    const userData = tokenService.validateRefreshToken(refreshToken)
    // убеждаемся что токен находится в бд
    const tokenFromDb = await tokenService.findToken(refreshToken)

    // валидация и токен в бд
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    // получаем пользователя с бд, тк инфа может устареть
    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

  async getAllUsers() {
    // без параметров вернет все записи в бд
    const users = await UserModel.find()
    return users
  }
}

module.exports = new UserService()
