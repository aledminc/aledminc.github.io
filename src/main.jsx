import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// BrowserRouter (clean paths) pairs with the dist/404.html fallback created in
// the deploy workflow, so direct hits and refreshes on /projects resolve.
// No basename needed: this is a user-site repo served from the domain root.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
