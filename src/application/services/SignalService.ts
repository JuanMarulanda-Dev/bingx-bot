import { ISignalProvider } from '../../domain/interfaces/ISignalProvider';
import { TradingSignal } from '../../domain/entities/TradingSignal';

export class SignalService {
  private providers: ISignalProvider[];

  constructor(providers: ISignalProvider[]) {
    this.providers = providers;
  }

  async getAllSignals(): Promise<TradingSignal[]> {
    const signalsPromises = this.providers.map(provider => 
      provider.getLatestSignals()
    );
    
    const results = await Promise.all(signalsPromises);
    return results.flat();
  }

  async getSignalsByCurrency(currency: string): Promise<TradingSignal[]> {
    const signalsPromises = this.providers.map(provider => 
      provider.getSignalsByCurrency(currency)
    );
    
    const results = await Promise.all(signalsPromises);
    return results.flat();
  }
} 