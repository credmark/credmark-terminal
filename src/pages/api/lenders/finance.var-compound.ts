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
      slug: 'finance.var-compound',
      input: { window: '180 days', interval: 10, confidence: 0.01 },
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
