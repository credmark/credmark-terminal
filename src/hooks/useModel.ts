import { useCallbackRef } from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useMemo, useState } from 'react';

import {
  ModelRunError,
  ModelRunResponse,
  ModelSeriesOutput,
} from '~/types/model';

import { useDeepCompareCallback } from './useDeepCompare';

interface ModelRunnerCallbackProps<I> {
  slug: string;
  version?: string;
  chainId?: number;
  blockNumber?: number | 'latest';
  input: I;
}

export function useModelRunnerCallback<I, O>({
  slug,
  version,
  chainId = 1,
  blockNumber = 'latest',
  input,
}: ModelRunnerCallbackProps<I>) {
  // Using deep compare callback for input equality
  return useDeepCompareCallback(
    async (abortSignal?: AbortSignal) => {
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
    [blockNumber, chainId, input, slug, version],
  );
}

interface SimpleModelRunnerProps<I, O> extends ModelRunnerCallbackProps<I> {
  validateOutput?: (output: O) => void;
}

interface HistoricalModelRunnerProps<I, O> extends ModelRunnerCallbackProps<I> {
  window: number; // In days
  interval: number; // In days
  validateRow?: (output: O) => void;
}

type ModelRunnerProps<I, O> =
  | SimpleModelRunnerProps<I, O>
  | HistoricalModelRunnerProps<I, O>;

export function useModelRunner<I, O>(
  props: SimpleModelRunnerProps<I, O>,
): {
  loading: boolean;
  error: ModelRunError | undefined;
  errorMessage: string | undefined;
  output: O;
};

export function useModelRunner<I, O>(
  props: HistoricalModelRunnerProps<I, O>,
): {
  loading: boolean;
  error: ModelRunError | undefined;
  errorMessage: string | undefined;
  output: ModelSeriesOutput<O>;
};

export function useModelRunner<I, O>(props: ModelRunnerProps<I, O>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ModelRunError>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [output, setOutput] = useState<O | ModelSeriesOutput<O>>();

  const { window, interval, validateRow } = props as HistoricalModelRunnerProps<
    I,
    O
  >;

  const { validateOutput } = props as SimpleModelRunnerProps<I, O>;

  const isHistorical = useMemo(
    () => typeof window === 'number' && typeof interval === 'number',
    [interval, window],
  );

  const runModel = useModelRunnerCallback<unknown, O | ModelSeriesOutput<O>>(
    isHistorical
      ? {
          slug: 'series.time-window-interval',
          input: {
            modelSlug: props.slug,
            modelInput: props.input,
            modelVersion: props.version,
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
  );

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

  useEffect(() => {
    setError(undefined);
    setErrorMessage(undefined);
    setLoading(true);

    const abortController = new AbortController();
    runModel(abortController.signal)
      .then((resp) => {
        if (resp.error) {
          setError(resp.error);
          throw new Error(
            resp.error.message ?? 'Some unexpected error has occurred',
          );
        }

        validateOutputMemoized(resp.output);

        setOutput(resp.output);
      })
      .catch((err) => {
        if (abortController.signal.aborted) {
          return;
        }

        console.log(err);
        setErrorMessage(err.message ?? '');
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [runModel, validateOutputMemoized]);

  return { loading, error, errorMessage, output };
}
