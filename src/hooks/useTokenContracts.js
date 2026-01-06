import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../config';
import MockERC20ABI from '../abis/MockERC20.json';
import TokenDepositABI from '../abis/TokenDeposit.json';

export const useTokenContracts = (signer) => {
    const [mockERC20, setMockERC20] = useState(null);
    const [tokenDeposit, setTokenDeposit] = useState(null);

    useEffect(() => {
        if (signer) {
            const mockERC20Contract = new ethers.Contract(
                CONTRACT_ADDRESSES.MockERC20,
                MockERC20ABI,
                signer
            );

            const tokenDepositContract = new ethers.Contract(
                CONTRACT_ADDRESSES.TokenDeposit,
                TokenDepositABI,
                signer
            );

            setMockERC20(mockERC20Contract);
            setTokenDeposit(tokenDepositContract);
        } else {
            setMockERC20(null);
            setTokenDeposit(null);
        }
    }, [signer]);

    return { mockERC20, tokenDeposit };
};
