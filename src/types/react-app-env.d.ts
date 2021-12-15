declare module 'fortmatic';

type Listener = (...args: Array<any>) => void;
interface Window {
  web3?: Record<string, unknown>;
  ethereum?: {
    isMetaMask: boolean;
    on: (event: string, listener: Listener) => void;
    removeListener: (event: string, listener: Listener) => void;
  };
}
