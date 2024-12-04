import { BingXAccountService } from '../../services/bingxAccountService';
import { Environment, UriType } from '../../../config/environment';
import { getUris } from '../../../config/uriConfig';
import { Method } from '../../../config/methods';
import { PerpetualFutureTradingRequest } from '../../../domain/entities/PerpetualFutureTradingRequest';
import { RequestConfig } from '../../../config/requestConfig';

import { YoutubeSignalAdapter } from '../../../infraestucture/adapters/YoutubeSignalAdapter';

const ENVIRONMENT = import.meta.env.VITE_BINGX_ENVIRONMENT as Environment;
const PROTOCOL = import.meta.env.VITE_BINGX_PROTOCOL;
const URIS: ReturnType<typeof getUris> = getUris(ENVIRONMENT);

export class TradeAccountsUseCase {
  private readonly accountService: BingXAccountService;

  constructor(accountService: BingXAccountService) {
    this.accountService = accountService;
  }

  private async getSignalsFromYoutube() {
    const youtubeAdapter = new YoutubeSignalAdapter();
    const signals = await youtubeAdapter.getLatestSignals();
    return signals;
  }
  
  private createTradeConfig(tradeRequest: PerpetualFutureTradingRequest): RequestConfig {
    return {
      uri: URIS[UriType.OPEN_POSITION],
      method: Method.POST,
      payload: tradeRequest,
      protocol: PROTOCOL
    };
  }

  private async executeTradesForAllAccounts(tradeRequest: PerpetualFutureTradingRequest) {
    console.log(`Executing trades for ${this.accountService.getAccounts().length} accounts in ${ENVIRONMENT} environment`);
    //Get all signals
  
    //Create trade request for each signal
  
    //get future budget for each account to calculate the amount of contracts to trade
  
    //Execute trade for each account
  
    const results = await Promise.allSettled(
      this.accountService.getAccounts().map(async (account) => {
        try {
          console.log(`Processing trade for account: ${account.owner}`);
          const config = this.createTradeConfig(tradeRequest);
          console.log(config);
          //const result = await openTradePosition(config, account.apiKey, account.secretKey);
          const result = {}
          return {
            account: account.owner,
            success: true,
            result
          };
        } catch (error) {
          console.error(`Error processing trade for account ${account.owner}:`, error);
          return {
            account: account.owner,
            success: false,
            error
          };
        }
      })
    );
  
    return results;
  }

  async execute() {
    const signals = await this.getSignalsFromYoutube();
    console.log(signals);
    const results = await this.executeTradesForAllAccounts(signals);
    //const results = {}
    return results;
  }
}
