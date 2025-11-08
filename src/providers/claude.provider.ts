import { IModelProvider, ProviderResponse } from "./base.provider";

export class ClaudeProvider implements IModelProvider {
    name = "Anthropic";
    modelId = "claude-2";

    constructor(private apiKey: string) {}

    async sendPrompt(prompt: string): Promise<ProviderResponse> {
        const start = Date.now();

        // Simulate API call
        const mockOutput = `Claude-2 MOCK REPLY TO: ${prompt}`;
        const latencyMs = Date.now() - start;

        return {
            model: this.modelId,
            output: mockOutput,
            latencyMs
        };
    }
}
