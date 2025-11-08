import { IModelProvider, ProviderResponse } from "./base.provider";

export class GPTProvider implements IModelProvider {
    name = "OpenAI";
    modelId = "gpt-4o";

    constructor(private apiKey: string) {}

    async sendPrompt(prompt: string): Promise<ProviderResponse> {
        const start = Date.now();

        // Simulate API call
        const mockOutput = `GPT-4o MOCK REPLY TO: ${prompt}`;
        const latencyMs = Date.now() - start;

        return {
            model: this.modelId,
            output: mockOutput,
            latencyMs
        };
    }
}
