const AddressZero = '0x0000000000000000000000000000000000000000';
import { Contract, type ContractInterface, type BrowserProvider, type JsonRpcSigner } from 'ethers';

import isAddress from './isAddress';

// account is not optional
export async function getSigner(
  library: BrowserProvider,
  account: string,
): Promise<JsonRpcSigner> {
  return library.getSigner(account);
}

// account is optional
export async function getProviderOrSigner(
  library: BrowserProvider,
  account?: string,
): Promise<BrowserProvider | JsonRpcSigner> {
  return account ? getSigner(library, account) : library;
}

// account is optional
export default function getContract(
  address: string,
  ABI: any,
  library: BrowserProvider,
  account?: string,
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, library);
}
