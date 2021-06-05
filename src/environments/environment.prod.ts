import { commonVariables } from './common-env-variables';

export const environment = {
  production: true,
  hiddenHostGift: true,
  hmr: false,
  configFile: 'https://thermomix-api.doxa-holdings.com',
  configAdmin: 'https://thermomix-api.doxa-holdings.com',
  // configFile: 'http://localhost:8888',
  // configAdmin: 'http://localhost:8888',

  storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/prod-retail-public-bucket.doxa-holdings.com/',

  ...commonVariables
};
