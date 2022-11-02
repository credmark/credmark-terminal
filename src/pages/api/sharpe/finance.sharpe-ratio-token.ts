import axios from 'axios';
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
    try {
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
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        res.status(err.response.status ?? 500);
        res.json(err.response.data);
      } else {
        res.status(500).json({ message: 'Unexpected error has occurred' });
      }
    }
  });
