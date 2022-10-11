import cors from 'cors';
import helmet from 'helmet';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { rateLimiter, runComposeMapModel, runModel } from '~/utils/modelApi';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default nc<NextApiRequest, NextApiResponse>()
  .use(rateLimiter())
  .use(cors())
  .use(helmet())
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const options = {
      slug: 'finance.sharpe-ratio-token',
      input: req.body.input,
      blockNumber: req.body.blockNumber,
      version: req.body.version,
    };

    let result;
    if ('inputs' in req.body) {
      result = await runComposeMapModel({
        ...options,
        inputs: req.body.inputs,
      });
    } else {
      result = await runModel(options);
    }

    res.json(result);
  });