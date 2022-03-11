import { getAddress } from '@ethersproject/address';

// returns the checksummed address if the address is valid, otherwise returns false
export default function isAddress(value: string | undefined): string | false {
  if (!value) return false;

  try {
    return getAddress(value);
  } catch {
    return false;
  }
}
