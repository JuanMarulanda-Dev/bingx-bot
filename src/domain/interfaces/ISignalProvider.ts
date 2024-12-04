import { TradingSignal } from '../entities/TradingSignal';

export interface ISignalProvider {
  getLatestSignals(): Promise<TradingSignal[]>;
  getSignalsByCurrency(currency: string): Promise<TradingSignal[]>;
} 