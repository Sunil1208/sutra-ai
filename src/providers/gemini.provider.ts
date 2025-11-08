import { IModelProvider, ProviderResponse } from "./base.provider";

export class GeminiProvider implements IModelProvider {
    name = "Google";
    modelId = "gemini-1.5";

    constructor(private apiKey: string) {}

    async sendPrompt(prompt: string): Promise<ProviderResponse> {
        const start = Date.now();

        // Simulate API call
        const mockOutput = `Gemini MOCK REPLY TO: ${prompt}`;
        const latencyMs = Date.now() - start;

        return {
            model: this.modelId,
            output: mockOutput,
            latencyMs
        };
    }
}
