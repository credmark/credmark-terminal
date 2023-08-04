import axios from 'axios';
import cors from 'cors';
import helmet from 'helmet';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { rateLimiter, runModel, RunModelOptions } from '~/utils/modelApi';

export default nc<NextApiRequest, NextApiResponse>()
  .use(rateLimiter())
  .use(cors())
  .use(helmet())
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const options: RunModelOptions = {
        chainId: 137,
        slug: 'ichi.vault-performance',
        input: {
          address: req.body.input.address,
          days_horizon: req.body.input.days_horizon,
          base: req.body.input.base,
        },
        version: req.body.version,
        blockNumber: req.body.blockNumber,
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
