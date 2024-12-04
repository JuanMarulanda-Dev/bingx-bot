import { openTradePosition } from '../application/services/bingxService';
import { Environment } from '../config/environment';
import { getUris } from '../config/uriConfig';

interface Account {
  apiKey: string;
  secret: string;
  name: string;
}

interface TradeRequest {
  symbol: string;
  side: 'BUY' | 'SELL';
  positionSide: 'LONG' | 'SHORT';
  type: 'MARKET' | 'LIMIT';
  quantity: number;
  takeProfit?: string;
}

export class TradeAccountsUseCase {
  private readonly accounts: Account[];
  private readonly environment: Environment;
  private readonly uris: ReturnType<typeof getUris>;

  constructor(environment: Environment = Environment.DEVELOPMENT) {
    this.environment = environment;
    this.uris = getUris(environment);
    // Ejemplo de cuentas - En producción esto podría venir de una base de datos
    this.accounts = [
      { 
        apiKey: "key1", 
        secret: "secret1",
        name: "Account 1" 
      },
      { 
        apiKey: "key2", 
        secret: "secret2",
        name: "Account 2" 
      }
    ];
  }

  private createTradeConfig(tradeRequest: TradeRequest) {
    return {
      uri: this.uris.test, // o this.uris.production según necesites
      method: "POST",
      payload: tradeRequest,
      protocol: "https"
    };
  }

  async executeTradesForAllAccounts(tradeRequest: TradeRequest) {
    console.log(`Executing trades for ${this.accounts.length} accounts in ${this.environment} environment`);
    
    const results = await Promise.allSettled(
      this.accounts.map(async (account) => {
        try {
          console.log(`Processing trade for account: ${account.name}`);
          const config = this.createTradeConfig(tradeRequest);
          const result = await openTradePosition(config, account.apiKey, account.secret);
          return {
            account: account.name,
            success: true,
            result
          };
        } catch (error) {
          console.error(`Error processing trade for account ${account.name}:`, error);
          return {
            account: account.name,
            success: false,
            error
          };
        }
      })
    );

    return results;
  }
} 