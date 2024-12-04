export interface RequestConfig {
    uri: string;
    method: string;
    payload: Record<string, any>;
    protocol: string;
}