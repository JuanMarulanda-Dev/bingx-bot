
import { TradingSymbol, OrderType, OrderSide, PositionSide, StopOrder, isValidTradingSymbol, PerpetualFutureTradingRequestProps } from '../../shared/types/PerpetualFutureTypes';

export class PerpetualFutureTradingRequest {
  // required fields
  readonly symbol: TradingSymbol ;
  readonly type: OrderType;
  readonly side: OrderSide;
  readonly timestamp: number;

  // optional fields
  readonly positionSide?: PositionSide;
  readonly price?: number;
  readonly quantity?: number;
  readonly takeProfit?: StopOrder;
  readonly stopLoss?: StopOrder;

  private constructor(props: PerpetualFutureTradingRequestProps) {
    this.symbol = props.symbol;
    this.type = props.type;
    this.side = props.side;
    this.timestamp = props.timestamp;
    this.positionSide = props.positionSide;
    this.price = props.price;
    this.quantity = props.quantity;
    this.takeProfit = props.takeProfit;
    this.stopLoss = props.stopLoss;
  }

  public validate(): boolean { 
    if (!isValidTradingSymbol(this.symbol)) {
      return false;
    }

    if (!Object.values(OrderType).includes(this.type)) {
      return false;
    }

    if (!Object.values(OrderSide).includes(this.side)) {
      return false;
    }

    if (!this.timestamp || this.timestamp <= 0) {
      return false;
    }

    if (this.positionSide && !Object.values(PositionSide).includes(this.positionSide)) {
      return false;
    }

    return true;
  }

  // Builder to ensure creation with required fields
  static Builder = class {
    private props: Partial<PerpetualFutureTradingRequestProps> = {};

    withSymbol(symbol: TradingSymbol): this {
      this.props.symbol = symbol;
      return this;
    }

    withType(type: OrderType): this {
      this.props.type = type;
      return this;
    }

    withSide(side: OrderSide): this {
      this.props.side = side;
      return this;
    }

    withTimestamp(timestamp: number): this {
      this.props.timestamp = timestamp;
      return this;
    }

    // optional methods
    withPositionSide(positionSide: PositionSide): this {
      this.props.positionSide = positionSide;
      return this;
    }

    withPrice(price: number): this {
      this.props.price = price;
      return this;
    }

    withQuantity(quantity: number): this {
      this.props.quantity = quantity;
      return this;
    }

    withTakeProfit(takeProfit: StopOrder): this {
      this.props.takeProfit = takeProfit;
      return this;
    }

    withStopLoss(stopLoss: StopOrder): this {
      this.props.stopLoss = stopLoss;
      return this;
    }

    build(): PerpetualFutureTradingRequest {
      if (!this.props.symbol || !this.props.type || !this.props.side || !this.props.timestamp) {
        throw new Error('Missing required fields: symbol, type, side, and timestamp are mandatory');
      }

      if (!isValidTradingSymbol(this.props.symbol)) {
        throw new Error(`Invalid trading symbol: ${this.props.symbol}`);
      }

      return new PerpetualFutureTradingRequest(this.props as PerpetualFutureTradingRequestProps);
    }
  }

  public static fromJSON(json: string): PerpetualFutureTradingRequest {
    const data = JSON.parse(json);
    
    return new PerpetualFutureTradingRequest.Builder()
      .withSymbol(data.symbol)
      .withType(data.type)
      .withSide(data.side)
      .withTimestamp(data.timestamp)
      .withPositionSide(data.positionSide)
      .withPrice(data.price)
      .withQuantity(data.quantity)
      .withTakeProfit(data.takeProfit ? JSON.parse(data.takeProfit) : undefined)
      .withStopLoss(data.stopLoss ? JSON.parse(data.stopLoss) : undefined)
      .build();
  }

  public toJSON(): string {
    return JSON.stringify({
      symbol: this.symbol,
      type: this.type,
      side: this.side,
      timestamp: this.timestamp,
      positionSide: this.positionSide,
      price: this.price,
      quantity: this.quantity,
      takeProfit: this.takeProfit ? JSON.stringify(this.takeProfit) : undefined,
      stopLoss: this.stopLoss ? JSON.stringify(this.stopLoss) : undefined
    });
  }
} 