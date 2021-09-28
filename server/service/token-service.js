// логика для работы с токеном

const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')

class TokenService {
  // генерируем accessToken и refreshToken токены
  // принимает payload, который мы будем прятать в токенах
  // это те данные, которые в токен вшиваются
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      // время жизни
      expiresIn: '15m',
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      // время жизни
      expiresIn: '1d',
    })
    return {
      accessToken,
      refreshToken,
    }
  }


  // ф-ции для валидации токена
  validateAccessToken(token) {
    try {
      // вернется сам payload
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }

  // сохранение, удаление, поиск токена для конкретного пользователя
  async saveToken(userId, refreshToken) {
    // сначала пробуем найти такой токен по userId
    // ВАЖНО!!! при таком подходе у одного пользователя будет только один токен
    // и при попытки войти на акк с другого у-ва, со старого вас выкинет
    const tokenData = await tokenModel.findOne({ user: userId })
    if (tokenData) {
      // мы перезаписываем refreshToken токен
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    // сохраняем refreshToken по id пользователя
    const token = await tokenModel.create({ user: userId, refreshToken })
    return token
  }

  async removeToken(refreshToken) {
    // сама логика удаления
    const tokenData = await tokenModel.deleteOne({ refreshToken })
    return tokenData
  }

  // есть ли токен в бд
  async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({ refreshToken })
    return tokenData
  }
}

module.exports = new TokenService()
