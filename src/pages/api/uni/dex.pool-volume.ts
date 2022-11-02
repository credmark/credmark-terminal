import axios from 'axios';
import cors from 'cors';
import helmet from 'helmet';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { rateLimiter, runModel } from '~/utils/modelApi';

export default nc<NextApiRequest, NextApiResponse>()
  .use(rateLimiter())
  .use(cors())
  .use(helmet())
  .post(async (req, res) => {
    try {
      const options = {
        slug: 'dex.pool-volume',
        input: {
          pool_info_model: 'uniswap-v2.pool-tvl',
          interval: 7200,
          address: req.body.input.address,
        },
        blockNumber: req.body.blockNumber,
        version: req.body.version,
      };

      const result = await runModel(options);
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
