import ReactDOM from 'react-dom';

import Web3Provider from './store/Web3Provider';
import CollectionProvider from './store/CollectionProvider';
import MarketplaceProvider from './store/MarketplaceProvider';
import App from './App';
import './index.css'

ReactDOM.render(
  <Web3Provider>
    <CollectionProvider>
      <MarketplaceProvider>
        <App />
      </MarketplaceProvider>
    </CollectionProvider>
  </Web3Provider>, 
  document.getElementById('root')
);