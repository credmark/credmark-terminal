export interface Env {
  type: 'LOCAL' | 'DEV' | 'PROD';
  host: string;
  apiHost: string;
  githubClientId: string;

  infuraKey: string;
  formaticKey: string;
  portisId: string;
  walletconnectBridgeUrl?: string;
  coinbaseLink: string;
}
