import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../config';

const TokenDeposit = ({ tokenDeposit, setMessage }) => {
    const [depositAmount, setDepositAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const depositTokens = async () => {
        if (!tokenDeposit || !depositAmount) return;

        try {
            setLoading(true);
            setMessage('Depositing tokens...');

            const amount = ethers.parseEther(depositAmount);
            const tx = await tokenDeposit.depositTokens(CONTRACT_ADDRESSES.MockERC20, amount);
            await tx.wait();

            setMessage(`Successfully deposited ${depositAmount} tokens!`);
            setDepositAmount('');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section">
            <h2>2. Deposit Tokens</h2>
            <input
                type="text"
                placeholder="Amount (e.g., 100)"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
            />
            <button onClick={depositTokens} disabled={loading || !depositAmount}>
                {loading ? 'Processing...' : 'Deposit Tokens'}
            </button>
        </div>
    );
};

export default TokenDeposit;
