import React, { createContext } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Store from './store/store'

interface State {
  store: Store
}

// взаимодействие с store
export const store = new Store()

// используем store внутри компонентов
export const Context = createContext<State>({
  store,
})

ReactDOM.render(
  // чтобы мы могли получать с помощью хука useState
  // доступ к этому контексту
  <Context.Provider
    value={{
      store,
    }}
  >
    <App />
  </Context.Provider>,
  document.getElementById('root')
)
