import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles.css'; // Import cyberpunk styling
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import required wallet adapter packages
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl } from '@solana/web3.js';
import { Buffer } from "buffer";
// Default styles for wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

// Tambahkan Buffer ke global scope agar kompatibel dengan library lama
window.Buffer = Buffer;


// Set up wallet configuration
const wallets = [new PhantomWalletAdapter()];
const endpoint = clusterApiUrl('testnet');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
