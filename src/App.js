import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { useWallet } from './hooks/useWallet';
import { useTokenContracts } from './hooks/useTokenContracts';
import WalletConnect from './components/WalletConnect';
import TokenApproval from './components/TokenApproval';
import TokenDeposit from './components/TokenDeposit';
import SendToTwo from './components/SendToTwo';

function App() {
  const { account, signer, connectWallet, error: walletError } = useWallet();
  const { mockERC20, tokenDeposit } = useTokenContracts(signer);
  const [message, setMessage] = useState('');

  // Check balance
  const checkBalance = async () => {
    if (!mockERC20 || !account) return;

    try {
      const balance = await mockERC20.balanceOf(account);
      const formattedBalance = ethers.formatEther(balance);
      setMessage(`Your balance: ${formattedBalance} tokens`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Token Deposit & Send App</h1>

        <WalletConnect account={account} connectWallet={connectWallet} />

        {account && (
          <div>
            <button onClick={checkBalance}>Check Balance</button>
          </div>
        )}

        {(message || walletError) && <p className="message">{message || walletError}</p>}

        {account && (
          <>
            <TokenApproval mockERC20={mockERC20} setMessage={setMessage} />
            <TokenDeposit tokenDeposit={tokenDeposit} setMessage={setMessage} />
            <SendToTwo tokenDeposit={tokenDeposit} setMessage={setMessage} />
          </>
        )}
      </header>
    </div>
  );
}

export default App;