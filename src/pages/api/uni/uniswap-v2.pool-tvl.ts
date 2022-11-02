import axios from 'axios';
import cors from 'cors';
import helmet from 'helmet';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { rateLimiter, runHistoricalModel, runModel } from '~/utils/modelApi';

export default nc<NextApiRequest, NextApiResponse>()
  .use(rateLimiter())
  .use(cors())
  .use(helmet())
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const options = {
        slug: 'uniswap-v2.pool-tvl',
        input: {
          address: req.body.input.address,
        },
        blockNumber: req.body.blockNumber,
        version: req.body.version,
      };

      let result;
      if ('window' in req.body && 'interval' in req.body) {
        result = await runHistoricalModel({
          ...options,
          window: req.body.window,
          interval: req.body.interval,
        });
      } else {
        result = await runModel(options);
      }

      res.json(result);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        res.status(err.response.status ?? 500);
        res.json(err.response.data);
      } else {
        res.status(500).json({ message: 'Unexpected error has occurred' });
      }
    }
  });
