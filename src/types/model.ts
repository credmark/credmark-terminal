export interface CTypeRef {
  $ref: string;
}

export interface CTypeAllOf {
  allOf: Array<CType>;
}

export interface BaseCType {
  title?: string;
  description?: string;
}

export interface CTypeObject extends BaseCType {
  type: 'object';
  properties?: Record<string, CType>;
  required?: string[];
  definitions?: Record<string, CType>;
}

export interface CTypeArray extends BaseCType {
  type: 'array';
  items: CType | CType[];
  default?: unknown[];
  minItems?: number;
  maxItems?: number;
}

export interface CTypeString extends BaseCType {
  type: 'string';
  pattern?: string;
  format?: 'date' | 'evm-address';
  default?: string;
  maxLength?: number;
}

export interface CTypeInteger extends BaseCType {
  type: 'integer' | 'number';
  default?: number;
}

export interface CTypeBoolean extends BaseCType {
  type: 'boolean';
  default?: boolean;
}

export type CType =
  | CTypeObject
  | CTypeArray
  | CTypeString
  | CTypeInteger
  | CTypeBoolean
  | CTypeAllOf
  | CTypeRef;

export interface CModelMetadata {
  slug: string;
  displayName: string;
  description?: string;
  developer: string;
  input: CTypeObject;
  output: CTypeObject;
  error: CType;
}

export interface CModelRunError {
  code: string;
  message?: string;
  details?: unknown;
  permanent: boolean;
  stack: Array<{
    blockNumber: number;
    chainId: 1;
    slug: string;
    version: string;
    trace: string;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CRecord = Record<string, any>;

export interface CAdvancedConfig {
  version: string;
  chainId: number;
  blockNumber: number | string;
}
