import cors from 'cors';
import helmet from 'helmet';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { rateLimiter, runModel } from '~/utils/modelApi';

export default nc<NextApiRequest, NextApiResponse>()
  .use(rateLimiter())
  .use(cors())
  .use(helmet())
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const options = {
      slug: 'rpc.get-blocknumber',
      input: {
        timestamp: req.body.input.timestamp,
      },
      version: req.body.version,
    };

    const result = await runModel(options);
    res.json(result);
  });
