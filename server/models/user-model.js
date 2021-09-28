const { Schema, model } = require('mongoose')

// какие поля будут у пользователя
const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  // подтверждение почты
  isActivated: { type: Boolean, default: false },
  // ссылка для активации
  activationLink: { type: String },
})

module.exports = model('User', UserSchema)
