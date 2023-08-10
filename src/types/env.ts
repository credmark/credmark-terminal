export interface Env {
  host: string;
  apiHost: string;

  infuraKey: string;
  formaticKey: string;
  portisId: string;
  walletconnectBridgeUrl?: string;
  coinbaseLink: string;

  gtmTrackingId?: string;
  hotjarId?: string;

  isBeta: boolean;
}
