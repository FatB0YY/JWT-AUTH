import React, { FC, useContext, useState } from 'react'
import { Context } from '../index'
import { observer } from 'mobx-react-lite'

// функциональный реакт компонент
const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  // извлекаем store
  const { store } = useContext(Context)

  return (
    <div>
      <input
        // управляемый инпут
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type='text'
        placeholder='Email'
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type='password'
        placeholder='Пароль'
      />
      {/* просто две кнопки, можно заморочиться */}
      {/* вызываем action из store */}
      <button onClick={() => store.login(email, password)}>Логин</button>
      <button onClick={() => store.registration(email, password)}>
        Регистрация
      </button>
    </div>
  )
}

export default observer(LoginForm)
