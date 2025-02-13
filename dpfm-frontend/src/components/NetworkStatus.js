import React, { useEffect, useState } from 'react';
import { Alert, Button } from '@mui/material';
import PropTypes from 'prop-types';

function NetworkStatus({ web3Handler }) {
  const [network, setNetwork] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  useEffect(() => {
    checkNetwork();
  }, []);

  const checkNetwork = async () => {
    try {
      const currentNetwork = await web3Handler.getNetwork();
      setNetwork(currentNetwork);
      setIsCorrectNetwork(currentNetwork.chainId === 11155111); // Sepolia testnet
    } catch (error) {
      console.error('Network check failed:', error);
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  if (!isCorrectNetwork) {
    return (
      <Alert 
        severity="warning"
        action={
          <Button color="inherit" size="small" onClick={switchNetwork}>
            Switch to Sepolia
          </Button>
        }
      >
        Please connect to Sepolia testnet
      </Alert>
    );
  }

  return null;
}

NetworkStatus.propTypes = {
  web3Handler: PropTypes.object.isRequired
};

export default NetworkStatus;