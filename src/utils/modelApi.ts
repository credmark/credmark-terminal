import { NextApiRequest, NextApiResponse } from 'next';
import { RequestHandler } from 'next-connect';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { getClientIp } from 'request-ip';

import { ModelRunResponse, ModelSeriesOutput } from '~/types/model';

import Gateway from './gateway';

interface RunModelOptions {
  slug: string;
  version?: string;
  chainId?: number;
  blockNumber?: number | 'latest';
  input: unknown;
}

interface RunHistoricalModelOptions extends RunModelOptions {
  window: string;
  interval: string;
}

interface RunComposeMapModelOptions extends Omit<RunModelOptions, 'input'> {
  inputs: [];
}

export async function runModel<O = unknown>({
  slug,
  version,
  chainId = 1,
  blockNumber = 'latest',
  input,
}: RunModelOptions) {
  const resp = await Gateway.sendPostRequest('/v1/model/run', {
    slug,
    version,
    chainId,
    blockNumber,
    input,
  });

  return resp.data as ModelRunResponse<O>;
}

export function runHistoricalModel<O = unknown>({
  slug,
  version,
  chainId,
  blockNumber,
  input,
  window,
  interval,
}: RunHistoricalModelOptions) {
  return runModel<ModelSeriesOutput<O>>({
    slug: 'historical.run-model',
    input: {
      model_slug: slug,
      model_input: input,
      model_version: version,
      window,
      interval,
    },
    blockNumber: blockNumber,
    chainId: chainId,
  });
}

export function runComposeMapModel<O = unknown>({
  slug,
  chainId,
  blockNumber,
  inputs,
}: RunComposeMapModelOptions) {
  return runModel<ModelSeriesOutput<O>>({
    slug: 'compose.map-inputs',
    input: {
      modelSlug: slug,
      modelInputs: inputs,
    },
    blockNumber: blockNumber,
    chainId: chainId,
  });
}

const globalRateLimiter = new RateLimiterMemory({
  points: 600,
  duration: 60,
});

const extremeRateLimiter = new RateLimiterMemory({
  points: 30,
  duration: 60,
});

type RateLimiterType = 'global' | 'extreme';

export function rateLimiter(
  type: RateLimiterType = 'global',
): RequestHandler<NextApiRequest, NextApiResponse> {
  return (req, res, next) => {
    const limiter = type === 'global' ? globalRateLimiter : extremeRateLimiter;
    limiter
      .consume(<string>getClientIp(req), 1)
      .then((rateLimiterRes) => {
        res.setHeader('Retry-After', rateLimiterRes.msBeforeNext / 1000);
        res.setHeader('X-RateLimit-Limit', limiter.points);
        res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
        res.setHeader(
          'X-RateLimit-Reset',
          (Date.now() + rateLimiterRes.msBeforeNext) / 1000,
        );
        next();
      })
      .catch(() => {
        res.status(429).send('Too Many Requests');
      });
  };
}
