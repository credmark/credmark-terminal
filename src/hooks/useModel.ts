import axios, { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { ModelRunResponse } from '~/types/model';

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
  return useCallback(
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

interface ModelRunnerProps<I, O> extends ModelRunnerCallbackProps<I> {
  validateOutput?: (output: O) => void;
}

export function useModelRunner<I, O>({
  slug,
  version,
  chainId,
  blockNumber,
  input,
  validateOutput,
}: ModelRunnerProps<I, O>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ModelRunResponse<O>['error']>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [output, setOutput] = useState<O>();

  const runModel = useModelRunnerCallback<I, O>({
    slug,
    version,
    chainId,
    blockNumber,
    input,
  });

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

        validateOutput?.(resp.output);

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
  }, [runModel, validateOutput]);

  return { loading, error, errorMessage, output };
}
