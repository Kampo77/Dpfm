import { ethers } from 'ethers';

export class EventService {
  constructor(contract) {
    this.contract = contract;
    this.eventHandlers = new Map();
  }

  subscribe(eventName, callback) {
    const handler = (...args) => {
      const event = this.formatEvent(eventName, args);
      callback(event);
    };
    this.contract.on(eventName, handler);
    this.eventHandlers.set(eventName, handler);
  }

  unsubscribe(eventName) {
    const handler = this.eventHandlers.get(eventName);
    if (handler) {
      this.contract.off(eventName, handler);
      this.eventHandlers.delete(eventName);
    }
  }

  private formatEvent(eventName, args) {
    switch(eventName) {
      case 'TransactionAdded':
        return {
          type: eventName,
          amount: ethers.utils.formatEther(args[1]),
          category: args[2],
          timestamp: new Date()
        };
      // Add other event formats
    }
  }
}