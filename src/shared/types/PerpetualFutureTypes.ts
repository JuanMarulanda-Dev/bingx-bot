export enum TradingSymbol {
  ETH_USD = 'ETH-USD',
  BTC_USD = 'BTC-USD',
  LTC_USD = 'LTC-USD',
  SOL_USD = 'SOL-USD',
  XRP_USD = 'XRP-USD',
  ADA_USD = 'ADA-USD',
  BHC_USD = 'BHC-USD', 
  DOT_USD = 'DOT-USD',
  MATIC_USD = 'MATIC-USD',
  LINK_USD = 'LINK-USD'
}

export enum OrderType {
  LIMIT = 'LIMIT', // Limit order
  MARKET = 'MARKET', // Market order
  STOP = 'STOP', // Stop loss order
  STOP_MARKET = 'STOP_MARKET', // Market stop loss order
  TAKE_PROFIT = 'TAKE_PROFIT', // Take profit order
  TAKE_PROFIT_MARKET = 'TAKE_PROFIT_MARKET' // Market take profit order
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum PositionSide {
  LONG = 'LONG', // Default
  SHORT = 'SHORT',
  BOTH = 'BOTH'
}

export enum WorkingType {
  MARK_PRICE = 'MARK_PRICE', // Default
  CONTRACT_PRICE = 'CONTRACT_PRICE',
  INDEX_PRICE = 'INDEX_PRICE'
}

export enum TimeInForce {
  GTC = 'GTC',  // Good Till Cancel
  IOC = 'IOC',  // Immediate or Cancel
  FOK = 'FOK',  // Fill or Kill
  GTX = 'GTX'   // Good Till Crossing
}

// Interfaces
export interface StopOrder {
  type: OrderType.STOP | OrderType.TAKE_PROFIT;
  stopPrice: number;
  price: number;
  workingType: WorkingType;
}

export interface PerpetualFutureTradingRequestProps {
  // required fields
  symbol: TradingSymbol;           // string (enum)
  type: OrderType;                 // string (enum)
  side: OrderSide;                 // string (enum)
  timestamp: number;               // int64 unit: milliseconds

  // optional fields
  positionSide?: PositionSide;     // string (enum)
  price?: number;                  // float64
  quantity?: number;               // float64
  stopPrice?: number;              // float64 Trigger price
  workingType?: WorkingType;       // string (enum)
  stopLoss?: StopOrder;            // string (JSON)
  takeProfit?: StopOrder;          // string (JSON)
  recvWindow?: number;             // int64
  timeInForce?: TimeInForce;       // string (enum)
}

export const isValidTradingSymbol = (symbol: string): symbol is TradingSymbol => {
  return Object.values(TradingSymbol).includes(symbol as TradingSymbol);
};

export const isValidStopOrder = (order: any): order is StopOrder => {
  return (
    order &&
    (order.type === OrderType.STOP || order.type === OrderType.TAKE_PROFIT) &&
    typeof order.stopPrice === 'number' &&
    typeof order.price === 'number' &&
    Object.values(WorkingType).includes(order.workingType)
  );
}; 