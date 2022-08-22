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
    const options = {
      slug: 'dex.pool-volume',
      input: {
        pool_info_model: 'curve-fi.pool-tvl',
        interval: 7200,
        address: req.body.input.address,
      },
      blockNumber: req.body.blockNumber,
      version: req.body.version,
    };

    const result = await runModel(options);
    res.json(result);
  });
