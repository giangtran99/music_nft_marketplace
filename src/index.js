import ReactDOM from 'react-dom';
import React from 'react'
import Web3Provider from './store/Web3Provider';
import CollectionProvider from './store/CollectionProvider';
import MarketplaceProvider from './store/MarketplaceProvider';
import App from './App';
import './index.css'
import './polyfill'

ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <CollectionProvider>
        <MarketplaceProvider>
          <App />
        </MarketplaceProvider>
      </CollectionProvider>
    </Web3Provider>,
  </React.StrictMode>,
  document.getElementById('root')
);