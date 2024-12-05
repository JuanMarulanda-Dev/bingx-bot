import { ISignalProvider } from '../../domain/interfaces/ISignalProvider';
import { TradingSignal } from '../../domain/entities/TradingSignal';
import { PositionSide } from '../../shared/types/PerpetualFutureTypes';

export class YoutubeSignalAdapter implements ISignalProvider {
  private mockSignals: TradingSignal[] = [
    {
      currency: 'BTC-USD',
      type: PositionSide.LONG,
      investmentPercentage: 10,
      stopLoss: 42000,
      takeProfit: 45000,
      timestamp: new Date(),
    },
    {
      currency: 'LTC-USD',
      type: PositionSide.LONG,
      investmentPercentage: 10,
      stopLoss: 42000,
      takeProfit: 45000,
      timestamp: new Date(),
    },
  ];

  async getLatestSignals(): Promise<TradingSignal[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.mockSignals;
  }

  async getSignalsByCurrency(currency: string): Promise<TradingSignal[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.mockSignals.filter(signal => signal.currency === currency);
  }
} 