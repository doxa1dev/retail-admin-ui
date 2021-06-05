import { commonVariables } from './common-env-variables';

export const environment = {
  production: true,
  hiddenHostGift: false,
  hmr: false,
  configFile: 'https://stag2-thermomix.doxa-holdings.com',
  configAdmin: 'https://stag2-thermomix.doxa-holdings.com',

  storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/stag2-retail-public-bucket.doxa-holdings.com/',

  ...commonVariables
};
