import { Environment, UriType } from './environment';

const uriConfigs: Record<Environment, Record<UriType, string>> = {
  [Environment.DEVELOPMENT]: {
    [UriType.OPEN_POSITION]: "/openApi/swap/v2/trade/order/test",
  },
  [Environment.PRODUCTION]: {
    [UriType.OPEN_POSITION]: "", ///openApi/swap/v1/trade/order
  }
};

export const getUris = (env: Environment): Record<UriType, string> => {
  return uriConfigs[env];
}; 