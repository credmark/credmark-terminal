import { useCallbackRef } from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';
import { Duration } from 'luxon';
import { useCallback, useMemo, useState } from 'react';

import {
  ModelRunError,
  ModelRunResponse,
  ModelSeriesOutput,
} from '~/types/model';

import { useDeepCompareEffect } from './useDeepCompare';

export interface ModelRunnerCallbackProps {
  slug: string;
  version?: string;
  chainId?: number;
  blockNumber?: number | 'latest';
  input: unknown;
}

export function useModelRunnerCallback<O>() {
  return useCallback(
    async (
      {
        slug,
        version,
        chainId = 1,
        blockNumber = 'latest',
        input,
      }: ModelRunnerCallbackProps,
      abortSignal?: AbortSignal,
    ) => {
      const resp: AxiosResponse<ModelRunResponse<O>> = await axios({
        method: 'POST',
        url: 'https://gateway.credmark.com/v1/model/run',
        data: {
          slug,
          version,
          chainId,
          blockNumber,
          input,
        },
        signal: abortSignal,
      });

      return resp.data;
    },
    [],
  );
}

interface CommonModelRunnerProps extends ModelRunnerCallbackProps {
  suspended?: boolean;
  afterRun?: () => void;
}

export interface SimpleModelRunnerProps<O> extends CommonModelRunnerProps {
  validateOutput?: (output: O) => void;
}

export interface HistoricalModelRunnerProps<O> extends CommonModelRunnerProps {
  window: Duration; // In days
  interval: Duration; // In days
  validateRow?: (output: O) => void;
}

export type ModelRunnerProps<O> =
  | SimpleModelRunnerProps<O>
  | HistoricalModelRunnerProps<O>;

export function useModelRunner<O>(props: SimpleModelRunnerProps<O>): {
  loading: boolean;
  error?: ModelRunError | undefined;
  errorMessage?: string | undefined;
  output?: O;
};

export function useModelRunner<O>(props: HistoricalModelRunnerProps<O>): {
  loading: boolean;
  error?: ModelRunError | undefined;
  errorMessage?: string | undefined;
  output?: ModelSeriesOutput<O>;
};

export function useModelRunner<O>(props: ModelRunnerProps<O>) {
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState<ModelRunError>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [output, setOutput] = useState<O | ModelSeriesOutput<O>>();

  const error = useMemo<ModelRunError | undefined>(() => {
    if (_error) {
      return _error;
    }

    if (errorMessage) {
      return {
        message: errorMessage,
        code: 'unknown',
        stack: [],
        permanent: false,
      };
    }

    return undefined;
  }, [_error, errorMessage]);

  const {
    validateRow,
    window: windowDuration,
    interval: intervalDuration,
  } = props as HistoricalModelRunnerProps<O>;

  const window = windowDuration
    ? `${windowDuration.as('days')} days`
    : undefined;
  const interval = intervalDuration
    ? `${intervalDuration.as('days')} days`
    : undefined;

  const { validateOutput } = props as SimpleModelRunnerProps<O>;

  const isHistorical = useMemo(
    () => typeof window === 'string' && typeof interval === 'string',
    [interval, window],
  );

  const runModel = useModelRunnerCallback<
    O | { result: ModelSeriesOutput<O> }
  >();

  const validateOutputMemoized = useCallbackRef(
    (output: O | ModelSeriesOutput<O>) => {
      // using type predicate to narrow output type
      const isHistoricalOutput = (
        output: O | ModelSeriesOutput<O>,
      ): output is ModelSeriesOutput<O> => isHistorical;

      if (isHistoricalOutput(output)) {
        if (Array.isArray(output.errors) && output.errors.length > 0) {
          console.log(output.errors);
          throw new Error(output.errors[0].error.message);
        }

        if (validateRow) {
          for (const row of output.series) {
            validateRow(row.output);
          }
        }
      } else {
        if (validateOutput) {
          validateOutput(output);
        }
      }
    },
  );

  const afterRunMemoized = useCallbackRef(() => props.afterRun?.());

  // Using deep compare effect for input object equality
  useDeepCompareEffect(() => {
    if (props.suspended) {
      return;
    }

    setError(undefined);
    setErrorMessage(undefined);
    setLoading(true);

    const abortController = new AbortController();
    runModel(
      isHistorical
        ? {
            slug: 'historical.run-model',
            input: {
              model_slug: props.slug,
              model_input: props.input,
              model_version: props.version,
              window,
              interval,
            },
            blockNumber: props.blockNumber,
            chainId: props.chainId,
          }
        : {
            slug: props.slug,
            version: props.version,
            chainId: props.chainId,
            blockNumber: props.blockNumber,
            input: props.input,
          },
      abortController.signal,
    )
      .then((resp) => {
        if (resp.error) {
          setError(resp.error);
          throw new Error(
            resp.error.message ?? 'Some unexpected error has occurred',
          );
        }

        const _output = isHistorical
          ? (resp.output as { result: ModelSeriesOutput<O> }).result
          : (resp.output as O);

        validateOutputMemoized(_output);
        console.log('_output', _output);
        setOutput(_output);
      })
      .catch((err) => {
        if (abortController.signal.aborted) {
          return;
        }

        console.log(err);
        setOutput(undefined);
        setErrorMessage(err.message ?? '');
      })
      .finally(() => {
        setLoading(false);
        afterRunMemoized();
      });

    return () => {
      abortController.abort();
    };
  }, [
    afterRunMemoized,
    interval,
    isHistorical,
    props.blockNumber,
    props.chainId,
    props.input,
    props.slug,
    props.suspended,
    props.version,
    runModel,
    validateOutputMemoized,
    window,
  ]);

  return { loading, error, errorMessage, output };
}
