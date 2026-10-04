import { BrowserProvider } from 'ethers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function getLibrary(provider: any): BrowserProvider {
  const library = new BrowserProvider(
    provider,
    typeof provider.chainId === 'number'
      ? provider.chainId
      : typeof provider.chainId === 'string'
      ? parseInt(provider.chainId)
      : 'any',
  );

  return library;
}
