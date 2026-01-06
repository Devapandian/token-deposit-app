/* global BigInt */
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
                const targetChainId = BigInt(80002); // Polygon Amoy Chain ID

                if (network.chainId !== targetChainId) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x13882' }], // 80002 in hex
                        });
                    } catch (switchError) {
                        // This error code indicates that the chain has not been added to MetaMask.
                        if (switchError.code === 4902) {
                            try {
                                await window.ethereum.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [
                                        {
                                            chainId: '0x13882',
                                            chainName: 'Polygon Amoy Testnet',
                                            nativeCurrency: {
                                                name: 'MATIC',
                                                symbol: 'MATIC',
                                                decimals: 18,
                                            },
                                            rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                                            blockExplorerUrls: ['https://amoy.polygonscan.com/'],
                                        },
                                    ],
                                });
                            } catch (addError) {
                                throw new Error("Failed to add Polygon Amoy network to MetaMask: " + addError.message);
                            }
                        } else if (switchError.code === 4001) {
                            throw new Error("Network switch rejected by user.");
                        } else {
                            throw new Error("Failed to switch to Polygon Amoy network: " + switchError.message);
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

    useState(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
            window.ethereum.on('accountsChanged', () => {
                window.location.reload();
            });
        }
    }, []);

    return { provider, signer, account, connectWallet, error, setError };
};
