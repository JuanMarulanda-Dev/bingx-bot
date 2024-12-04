import { PositionSide } from '../../shared/types/PerpetualFutureTypes';

export interface TradingSignal {
  currency: string;
  type: PositionSide;
  investmentPercentage: number;
  stopLoss: number;
  takeProfit: number;
  timestamp: Date;
} 