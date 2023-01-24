import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {Auth0Provider} from '@auth0/auth0-react'
import {authConfig} from './config/auth_config'
import './index.css'



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider domain={authConfig.domain} clientId={authConfig.clientId} 
    authorizationParams={{
      redirect_uri: authConfig.redirect_url
    }}>
      <App />
    </Auth0Provider>
    
  </React.StrictMode>,
)
