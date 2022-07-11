import * as Yup from 'yup';

import {
  AnyRecord,
  FieldType,
  FieldTypeArray,
  FieldTypeBoolean,
  FieldTypeInteger,
  FieldTypeObject,
  FieldTypeString,
  ModelMetadata,
} from '~/types/model';

export function wrapWithBlockSeries(field: FieldType): FieldTypeObject {
  return {
    title: 'BlockSeries[TradingVolume]',
    description:
      'A DTO for the output of "series.*" models which run another\nmodel over a series of blocks.\n\nThe generic type specifies the class to use as the output\nin the ``BlockSeriesRow``.\n\nFor example ``blockSeries = BlockSeries[MyOutputClass](**data)``\nwhere ``blockSeries.series[0].output`` will be an instance of ``MyOutputClass``\n\nIf a permanent error occurs during a model run, the block and error\nwill be added to the errors array.\nIf a non-permament error occurs during a model run, the entire series\nwill generate an error.',
    type: 'object',
    properties: {
      series: {
        title: 'Series',
        description: 'List of series block outputs',
        default: [],
        type: 'array',
        items: {
          title: 'BlockSeriesRow',
          description:
            'A data row in a block series.\nThe generic type specifies the class to use as the output.\n\nFor example ``row = BlockSeriesRow[MyOutputClass](**data)``\nwhere ``row.output`` will be an instance of ``MyOutputClass``',
          type: 'object',
          properties: {
            blockNumber: {
              title: 'Blocknumber',
              description: 'Block number in the series',
              type: 'integer',
            },
            blockTimestamp: {
              title: 'Blocktimestamp',
              description: 'The Timestamp of the Block',
              type: 'integer',
            },
            sampleTimestamp: {
              title: 'Sampletimestamp',
              description: 'The Sample Blocktime',
              type: 'integer',
            },
            output: {
              title: 'Output',
              description: 'Output of the model run for this block',
              allOf: [
                {
                  $ref: '#/definitions/BlockSeriesRowOutput',
                },
              ],
            },
          },
          required: [
            'blockNumber',
            'blockTimestamp',
            'sampleTimestamp',
            'output',
          ],
        },
      },
      errors: {
        title: 'Errors',
        description:
          'If any permanent (deterministic) errors were returned from model runs, this array will contain blocks with errors',
        type: 'array',
        items: {
          $ref: '#/definitions/BlockSeriesErrorRow',
        },
      },
    },
    definitions: {
      ...(('definitions' in field && field.definitions) || {}),
      BlockSeriesRowOutput: field,
      ModelCallStackEntry: {
        title: 'ModelCallStackEntry',
        description: "An item in an error's call stack.",
        type: 'object',
        properties: {
          slug: {
            title: 'Slug',
            description: 'Model slug',
            type: 'string',
          },
          version: {
            title: 'Version',
            description: 'Model version',
            type: 'string',
          },
          chainId: {
            title: 'Chainid',
            description: 'Context chain id',
            type: 'integer',
          },
          blockNumber: {
            title: 'Blocknumber',
            description: 'Context block number',
            type: 'integer',
          },
          trace: {
            title: 'Trace',
            description: 'Trace of code that generated the error',
            type: 'string',
          },
        },
        required: ['slug', 'version'],
      },
      ModelErrorDTO: {
        title: 'ModelErrorDTO',
        description:
          'Data fields common to all error types:\nModelDataError, ModelRunError, ModelInputError etc.',
        type: 'object',
        properties: {
          type: {
            title: 'Type',
            description: 'Error type',
            type: 'string',
          },
          message: {
            title: 'Message',
            description: 'Error message',
            type: 'string',
          },
          stack: {
            title: 'Stack',
            description:
              'Model call stack. Last element is the model that raised the error.',
            default: [],
            type: 'array',
            items: {
              $ref: '#/definitions/ModelCallStackEntry',
            },
          },
          code: {
            title: 'Code',
            description: 'Short identifier for the type of error',
            default: 'generic',
            type: 'string',
          },
          detail: {
            title: 'Detail',
            description: 'Arbitrary data object srelated to the error.',
            type: 'object',
          },
          permanent: {
            title: 'Permanent',
            description:
              'If true, the error will always give the same result for the same context.',
            default: false,
            type: 'boolean',
          },
        },
        required: ['type', 'message'],
      },
      BlockSeriesErrorRow: {
        title: 'BlockSeriesErrorRow',
        description: 'An error row in a block series.',
        type: 'object',
        properties: {
          blockNumber: {
            title: 'Blocknumber',
            description: 'Block number in the series',
            type: 'integer',
          },
          blockTimestamp: {
            title: 'Blocktimestamp',
            description: 'The Timestamp of the Block',
            type: 'integer',
          },
          sampleTimestamp: {
            title: 'Sampletimestamp',
            description: 'The Sample Blocktime',
            type: 'integer',
          },
          error: {
            title: 'Error',
            description: 'Error DTO of the model run for this block',
            allOf: [
              {
                $ref: '#/definitions/ModelErrorDTO',
              },
            ],
          },
        },
        required: ['blockNumber', 'blockTimestamp', 'sampleTimestamp', 'error'],
      },
    },
  };
}

type InputSchema = ModelMetadata['input'];

export function getUnreferencedInput(
  inputSchema: InputSchema,
  input: FieldType,
):
  | FieldTypeObject
  | FieldTypeArray
  | FieldTypeString
  | FieldTypeInteger
  | FieldTypeBoolean {
  if ('$ref' in input) {
    const refKey = Object.keys(inputSchema.definitions ?? {}).find(
      (def) => def === input.$ref.split('/').pop(),
    );

    if (!refKey) {
      throw new Error('Invalid ref');
    }

    return (inputSchema.definitions ?? {})[refKey] as
      | FieldTypeObject
      | FieldTypeArray
      | FieldTypeString
      | FieldTypeInteger
      | FieldTypeBoolean;
  } else if ('allOf' in input) {
    return getUnreferencedInput(inputSchema, input.allOf[0]);
  }

  return input;
}

export function computeInitialValues(
  inputSchema: InputSchema,
  type: FieldType,
): AnyRecord | boolean | string | number | unknown[] {
  const input = getUnreferencedInput(inputSchema, type);
  switch (input.type) {
    case 'object':
      return Object.entries(input.properties ?? {}).reduce<AnyRecord>(
        (iv, [key, value]) => ({
          ...iv,
          [key]: computeInitialValues(inputSchema, value),
        }),
        {},
      );
    case 'array':
      return [];
    case 'boolean':
      return input.default ?? false;
    case 'integer':
    case 'number':
      return input.default ?? 0;
    case 'string':
    default:
      return input.default ?? '';
  }
}

export function computeValidationSchema(
  inputSchema: InputSchema,
  type: FieldType,
  required: string[] = [],
  key = '',
): Yup.BaseSchema {
  const input = getUnreferencedInput(inputSchema, type);
  switch (input.type) {
    case 'object': {
      return Yup.object().shape(
        Object.entries(input.properties ?? {}).reduce<AnyRecord>(
          (iv, [key, value]) => ({
            ...iv,
            [key]: computeValidationSchema(
              inputSchema,
              value,
              input.required,
              key,
            ),
          }),
          {},
        ),
      );
    }
    case 'array': {
      let schema = Yup.array().of(
        computeValidationSchema(
          inputSchema,
          Array.isArray(input.items) ? input.items[0] : input.items,
        ),
      );
      if (input.minItems) schema = schema.min(input.minItems);
      if (input.maxItems) schema = schema.min(input.maxItems);
      return schema;
    }
    case 'boolean': {
      let schema = Yup.boolean();
      if (required.includes(key)) schema = schema.required('Required.');
      return schema;
    }
    case 'integer':
    case 'number': {
      let schema = Yup.number();
      if (required.includes(key)) schema = schema.required('Required.');
      return schema;
    }
    case 'string':
    default: {
      let schema = Yup.string().ensure();
      if (required.includes(key)) schema = schema.required('Required.');
      if (input.maxLength)
        schema = schema.max(
          input.maxLength,
          `Cannot be more than ${input.maxLength} characters`,
        );
      if (input.pattern)
        schema = schema.matches(
          new RegExp(input.pattern),
          `Invalid value. Not matching ${input.pattern}`,
        );
      return schema;
    }
  }
}
