import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState('');
    const [error, setError] = useState('');

    const connectWallet = useCallback(async () => {
        setError('');
        try {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const network = await provider.getNetwork();
                const targetChainId = BigInt(11155111); // Sepolia Chain ID

                if (network.chainId !== targetChainId) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
                        });
                    } catch (switchError) {
                        // This error code indicates that the chain has not been added to MetaMask.
                        if (switchError.code === 4902) {
                            try {
                                await window.ethereum.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [
                                        {
                                            chainId: '0xaa36a7',
                                            chainName: 'Sepolia Test Network',
                                            nativeCurrency: {
                                                name: 'SepoliaETH',
                                                symbol: 'ETH',
                                                decimals: 18,
                                            },
                                            rpcUrls: ['https://sepolia.infura.io/v3/'], // Or any public RPC
                                            blockExplorerUrls: ['https://sepolia.etherscan.io'],
                                        },
                                    ],
                                });
                            } catch (addError) {
                                throw new Error("Failed to add Sepolia network to MetaMask");
                            }
                        } else {
                            throw new Error("Failed to switch to Sepolia network");
                        }
                    }
                    // Re-initialize provider after switch
                }

                const signer = await provider.getSigner();
                const address = await signer.getAddress();

                setProvider(provider);
                setSigner(signer);
                setAccount(address);
            } else {
                setError('Please install MetaMask!');
            }
        } catch (err) {
            setError(err.message);
        }
    }, []);

    return { provider, signer, account, connectWallet, error, setError };
};
