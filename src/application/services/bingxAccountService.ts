import CryptoJS from "crypto-js";
import axios from "axios";
import { RequestConfig } from "../../config/requestConfig";

export interface BingXAccount {
  apiKey: string;
  secretKey: string;
  owner: string;
}

export class BingXAccountService {
  private static instance: BingXAccountService | null = null;
  private accounts: BingXAccount[];
  private readonly HOST: string;

  private constructor() {
    this.accounts = this.initializeAccounts();
    this.HOST = import.meta.env.VITE_BINGX_API_URL || "open-api.bingx.com";
  }

  private initializeAccounts(): BingXAccount[] {
    try {
      const accountsJson = import.meta.env.VITE_BINGX_ACCOUNTS;
      if (!accountsJson) {
        console.warn('BINGX_ACCOUNTS environment variable is not set');
        return [];
      }
      
      const accounts = JSON.parse(accountsJson);
      if (!Array.isArray(accounts)) {
        console.error('BINGX_ACCOUNTS must be a JSON array');
        return [];
      }
      
      return accounts;
    } catch (error) {
      console.error('Error parsing BINGX_ACCOUNTS:', error);
      return [];
    }
  }

  public static getInstance(): BingXAccountService {
    if (this.instance === null) {
      this.instance = new BingXAccountService();
    }
    return this.instance;
  }

  public static resetInstance(): void {
    this.instance = null;
  }

  public getAccounts(): BingXAccount[] {
    return [...this.accounts];
  }

  public getAccountByOwner(owner: string): BingXAccount | undefined {
    return this.accounts.find(account => account.owner === owner);
  }

  public getPublicAccountInfo(): Omit<BingXAccount, 'apiKey' | 'secretKey'>[] {
    return this.accounts.map(({ owner }) => ({ owner }));
  }

  private getParameters(payload: Record<string, any>, timestamp: number, urlEncode: boolean = false): string {
    const params = Object.entries(payload)
      .map(([key, value]) => {
        const encodedValue = urlEncode ? encodeURIComponent(value) : value;
        return `${key}=${encodedValue}`;
      })
      .join('&');
  
    return `${params}&timestamp=${timestamp}`;
  }

  public async openTradePosition(requestConfig: RequestConfig, apiKey: string, secret: string) {
    try {
      const timestamp = Date.now();
      const parameters = this.getParameters(requestConfig.payload, timestamp);
      const sign = CryptoJS.enc.Hex.stringify(
        CryptoJS.HmacSHA256(parameters, secret)
      );

      const url = `${requestConfig.protocol}://${this.HOST}${requestConfig.uri}?${this.getParameters(requestConfig.payload, timestamp, true)}&signature=${sign}`;

      const response = await axios({
        method: requestConfig.method,
        url,
        headers: {
          'X-BX-APIKEY': apiKey,
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error in openTradePosition:', error);
      throw error;
    }
  }
} 