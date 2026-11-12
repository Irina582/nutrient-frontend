import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { nutrients_store } from './nutrients_store'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={nutrients_store}>
      <App />
    </Provider>
  </React.StrictMode>,
)