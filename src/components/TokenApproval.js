import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../config';

const TokenApproval = ({ mockERC20, setMessage }) => {
    const [loading, setLoading] = useState(false);

    const approveTokens = async () => {
        if (!mockERC20) return;

        try {
            setLoading(true);
            setMessage('Approving tokens...');

            const amount = ethers.parseEther('1000'); // Approve 1000 tokens
            const tx = await mockERC20.approve(CONTRACT_ADDRESSES.TokenDeposit, amount);
            await tx.wait();

            setMessage('Tokens approved successfully!');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section">
            <h2>1. Approve Tokens</h2>
            <button onClick={approveTokens} disabled={loading}>
                {loading ? 'Processing...' : 'Approve 1000 Tokens'}
            </button>
        </div>
    );
};

export default TokenApproval;
