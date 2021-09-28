const { Schema, model } = require('mongoose')

// refresh token
// также можно хранить ip пользователя, принт браузера итд
const TokenSchema = new Schema({
  // ссылка на пользователя
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
})

module.exports = model('Token', TokenSchema)
