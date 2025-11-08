export interface IModelProvider {
    name: string;
    modelId: string;
    sendPrompt(prompt: string, options?: Record<string, any>): Promise<ProviderResponse>;
}

export interface ProviderResponse {
    model: string;
    output: string;
    latencyMs: number;
    cost?: number;
    cached?: boolean;
}
