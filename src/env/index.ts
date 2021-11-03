import DevEnv from '~/env/dev';
import LocalEnv from '~/env/local';
import ProdEnv from '~/env/prod';
import { Env } from '~/types/env';

const env: Env =
  process.env.APP_ENV === 'prod'
    ? ProdEnv
    : process.env.APP_ENV === 'dev'
    ? DevEnv
    : LocalEnv;

export default env;
