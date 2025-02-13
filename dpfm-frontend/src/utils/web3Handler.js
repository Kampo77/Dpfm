import { ethers } from 'ethers';

export class Web3Handler {
  constructor() {
    this.provider = null;
    this.signer = null;
  }

  async connect() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      return await this.signer.getAddress();
    } catch (error) {
      throw new Error(`Failed to connect: ${error.message}`);
    }
  }

  async getNetwork() {
    if (!this.provider) throw new Error('Not connected');
    return await this.provider.getNetwork();
  }

  async listenToAccountChanges(