import { BingXAccount, BingXAccountService } from '../../services/bingxAccountService';
import { Environment, UriType } from '../../../config/environment';
import { getUris } from '../../../config/uriConfig';
import { Method } from '../../../config/methods';
import { PerpetualFutureTradingRequest } from '../../../domain/entities/PerpetualFutureTradingRequest';
import { RequestConfig } from '../../../config/requestConfig';

import { YoutubeSignalAdapter } from '../../../infraestucture/adapters/YoutubeSignalAdapter';
import { TradingSignal } from '../../../domain/entities/TradingSignal';
import { OrderSide, OrderType, PositionSide, StopOrder, TradingSymbol, WorkingType } from '../../../shared/types/PerpetualFutureTypes';

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

  private getAmountToTrade(account: BingXAccount, percentage: number): number {
    // Get Future Budget
    const futureBudget = 1000;
    // Calculate amount to trade
    const amountToTrade = futureBudget * (percentage / 100);
    return amountToTrade;
  }

  private createOpenPositionTradeRequest(signal: TradingSignal, account: BingXAccount): PerpetualFutureTradingRequest {
    const amountToTrade = this.getAmountToTrade(account, signal.investmentPercentage);
    const request = new PerpetualFutureTradingRequest.Builder()
      .withSymbol(signal.currency as TradingSymbol)
      .withPositionSide(signal.type as PositionSide)
      .withSide(OrderSide.BUY)
      .withType(OrderType.MARKET)
      .withQuantity(amountToTrade)
      .withTimestamp(Date.now())
      
    if(signal.takeProfit){
      const takeProfit : StopOrder = {
        type: OrderType.TAKE_PROFIT,
        stopPrice: signal.takeProfit,
        price: signal.takeProfit,
        workingType: WorkingType.MARK_PRICE
      }
      request.withTakeProfit(takeProfit);
    }

    if(signal.stopLoss){
      const stopLoss : StopOrder = {
        type: OrderType.STOP,
        stopPrice: signal.stopLoss,
        price: signal.stopLoss,
        workingType: WorkingType.MARK_PRICE
      }
      request.withStopLoss(stopLoss);
    }

    return request.build();
  }

  private async executeTradesForAllAccounts(signals: TradingSignal[]) {
    console.log(`Executing trades for ${this.accountService.getAccounts().length} accounts in ${ENVIRONMENT} environment`);
    //Get all signals
  
    //Create trade request for each signal
  
    //get future budget for each account to calculate the amount of contracts to trade
  
    //Execute trade for each account
  
    const results = await Promise.allSettled(
      this.accountService.getAccounts().map(async (account) => {
        try {
          console.log(`Processing trades for account: ${account.owner}`);
          const tradeRequests = signals.map((signal) => this.createOpenPositionTradeRequest(signal, account));
          
          const results = await Promise.allSettled(
            tradeRequests.map(async (tradeRequest) => {
              const config = this.createTradeConfig(tradeRequest);
              console.log(config);  
              //const result = await openTradePosition(config, account.apiKey, account.secretKey);
              const result = {}
              return {
                account: account.owner,
                success: true,
                result
              };
            })
          );

          return results;
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
