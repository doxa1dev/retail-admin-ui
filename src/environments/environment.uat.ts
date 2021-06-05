import { commonVariables } from './common-env-variables';

export const environment = {
  production: true,
  hiddenHostGift: false,
  hmr: false,
  configFile: 'https://uat-thermomix.doxa-holdings.com',
  configAdmin: 'https://uat-thermomix.doxa-holdings.com',

  storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/uat-retail-public-bucket.doxa-holdings.com/',

  ...commonVariables
};
