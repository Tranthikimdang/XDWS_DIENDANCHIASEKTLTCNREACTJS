import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import StoreProvider from './store/provider'
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = "1002729752416-04i782uk4eb5iiu4daidq96ol2frvggl.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={clientId}>
  <Suspense>
    <StoreProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </Suspense>
  </GoogleOAuthProvider>
);
