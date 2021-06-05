import { commonVariables } from './common-env-variables';

export const environment = {
  production: true,
  hiddenHostGift: false,
  hmr: false,
  configFile: 'http://localhost:8888',
  configAdmin: 'http://localhost:8888',

  storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/stag2a-retail-public-bucket.doxa-holdings.com/',

  ...commonVariables
};
