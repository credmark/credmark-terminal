import axios from 'axios';
import cors from 'cors';
import helmet from 'helmet';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import Gateway from '~/utils/gateway';
import { rateLimiter } from '~/utils/modelApi';

export default nc<NextApiRequest, NextApiResponse>()
  .use(rateLimiter())
  .use(cors())
  .use(helmet())
  .get(async (_, res: NextApiResponse) => {
    try {
      const resp = await Gateway.sendGetRequest('/v1/usage/requests');
      res.json(resp.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        res.status(err.response.status ?? 500);
        res.json(err.response.data);
      } else {
        res.status(500).json({ message: 'Unexpected error has occurred' });
      }
    }
  });
