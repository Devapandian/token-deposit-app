import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../config';

const SendToTwo = ({ tokenDeposit, setMessage }) => {
    const [recipient1, setRecipient1] = useState('');
    const [amount1, setAmount1] = useState('');
    const [recipient2, setRecipient2] = useState('');
    const [amount2, setAmount2] = useState('');
    const [loading, setLoading] = useState(false);

    const sendToTwo = async () => {
        if (!tokenDeposit || !recipient1 || !amount1 || !recipient2 || !amount2) {
            setMessage('Please fill all fields!');
            return;
        }

        try {
            setLoading(true);
            setMessage('Sending tokens...');

            const amt1 = ethers.parseEther(amount1);
            const amt2 = ethers.parseEther(amount2);

            const tx = await tokenDeposit.sendToTwo(
                CONTRACT_ADDRESSES.MockERC20,
                recipient1,
                amt1,
                recipient2,
                amt2
            );
            await tx.wait();

            setMessage(`Successfully sent ${amount1} tokens to recipient 1 and ${amount2} tokens to recipient 2!`);
            setRecipient1('');
            setAmount1('');
            setRecipient2('');
            setAmount2('');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section">
            <h2>3. Send to Two Addresses</h2>
            <input
                type="text"
                placeholder="Recipient 1 Address"
                value={recipient1}
                onChange={(e) => setRecipient1(e.target.value)}
            />
            <input
                type="text"
                placeholder="Amount for Recipient 1"
                value={amount1}
                onChange={(e) => setAmount1(e.target.value)}
            />
            <input
                type="text"
                placeholder="Recipient 2 Address"
                value={recipient2}
                onChange={(e) => setRecipient2(e.target.value)}
            />
            <input
                type="text"
                placeholder="Amount for Recipient 2"
                value={amount2}
                onChange={(e) => setAmount2(e.target.value)}
            />
            <button onClick={sendToTwo} disabled={loading}>
                {loading ? 'Processing...' : 'Send to Two'}
            </button>
        </div>
    );
};

export default SendToTwo;
