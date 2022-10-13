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
    const options = {
      slug: 'compound-v2.all-pools-portfolio',
      input: {},
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
  });
