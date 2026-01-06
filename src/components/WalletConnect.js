import React from 'react';

const WalletConnect = ({ account, connectWallet }) => {
    if (account) {
        return (
            <div>
                <p>Connected: {account.substring(0, 6)}...{account.substring(38)}</p>
            </div>
        );
    }

    return (
        <button onClick={connectWallet} className="connect-btn">
            Connect Wallet
        </button>
    );
};

export default WalletConnect;
