declare module 'fortmatic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (...args: Array<any>) => void;
interface Window {
  web3?: Record<string, unknown>;
  ethereum?: {
    isMetaMask: boolean;
    on: (event: string, listener: Listener) => void;
    removeListener: (event: string, listener: Listener) => void;
  };
}
