import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import StoreProvider from './store/provider';
import {VisionUIControllerProvider} from "./admin/context/index";
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Suspense>
    <VisionUIControllerProvider>
    <StoreProvider> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
    </VisionUIControllerProvider>
    
  </Suspense>
);
