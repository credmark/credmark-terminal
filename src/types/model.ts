import { DurationObjectUnits } from 'luxon';

export interface FieldTypeRef {
  $ref: string;
}

export interface FieldTypeAllOf {
  allOf: Array<FieldType>;
}

export interface BaseFieldType {
  title?: string;
  description?: string;
}

export interface FieldTypeObject extends BaseFieldType {
  type: 'object';
  properties?: Record<string, FieldType>;
  required?: string[];
  definitions?: Record<string, FieldType>;
}

export interface FieldTypeArray extends BaseFieldType {
  type: 'array';
  items: FieldType | FieldType[];
  default?: unknown[];
  minItems?: number;
  maxItems?: number;
}

export interface FieldTypeString extends BaseFieldType {
  type: 'string';
  pattern?: string;
  format?: 'date' | 'evm-address';
  default?: string;
  maxLength?: number;
}

export interface FieldTypeInteger extends BaseFieldType {
  type: 'integer' | 'number';
  default?: number;
}

export interface FieldTypeBoolean extends BaseFieldType {
  type: 'boolean';
  default?: boolean;
}

export type FieldType =
  | FieldTypeObject
  | FieldTypeArray
  | FieldTypeString
  | FieldTypeInteger
  | FieldTypeBoolean
  | FieldTypeAllOf
  | FieldTypeRef;

export interface ModelMetadata {
  slug: string;
  displayName: string;
  category: string;
  description?: string;
  subcategory: string;
  developer: string;
  input: FieldTypeObject;
  output: FieldTypeObject;
  error: FieldType;
}

export interface ModelRunError {
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

export interface ModelRunResponse<O> {
  slug: string;
  version: string;
  chainId: number;
  blockNumber: number;
  output: O;
  error?: ModelRunError;
}

export interface ModelSeriesOutput<O> {
  series: Array<{
    blockNumber: number;
    blockTimestamp: number;
    sampleTimestamp: number;
    output: O;
  }>;
  errors?: Array<{ error: { message: string } }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>;

interface ModelRunnerNoneUtil {
  type: 'none';
}

interface ModelRunnerHistoricalUtil {
  type: 'historical';
  window: { value: number; unit: keyof DurationObjectUnits };
  interval: { value: number; unit: keyof DurationObjectUnits };
}

type ModelRunnerUtil = ModelRunnerNoneUtil | ModelRunnerHistoricalUtil;

export interface ModelRunnerConfig {
  version: string;
  chainId: number;
  blockNumber: number | string;

  utility?: ModelRunnerUtil;
}

export interface ModelUsage {
  ts: string;
  type: string;
  slug: string;
  version: string;
  count: string;
}

export type ModelRuntimeStat = 'min' | 'max' | 'mean' | 'median';
export interface ModelRuntime extends Record<ModelRuntimeStat, number> {
  slug: string;
  version: string;
}
export interface TopModels {
  slug: string;
  count: number;
}

export interface ModelInfo {
  slug: string;
  hSlug?: React.ReactNode;
  displayName: string;
  hDisplayName?: React.ReactNode;
  category: string;
  subcategory: string;
  description?: string;
  hDescription?: React.ReactNode;
  developer: string;
  hDeveloper?: React.ReactNode;
  monthlyUsage: number;
  runtime: Record<ModelRuntimeStat, number> | null;
  allTimeUsageRank: number;
}
