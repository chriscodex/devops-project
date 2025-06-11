import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const { VITE_BACKEND_URL } = import.meta.env

console.log('BACKEND_URL: ',VITE_BACKEND_URL)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
