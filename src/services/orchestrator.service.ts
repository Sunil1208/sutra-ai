import { GPTProvider, ClaudeProvider, GeminiProvider, IModelProvider } from "@providers";

/**
 * Orchestrator Service
 * The Orchestrator = Brain -> decided which LLM provider to use based on some logic
 * How it works:
 * 1. If user explicity requests a model (e.g. "gemini-1.5"), use that provider directly
 * 2. Otherwise, run "auto mode":
 *  - Estimate the prompt's complexity (length + number of questions)
 *  - Compare each provider using mock latency & cost data
 *  - Apply a weighted scoring formula (lower = better):
 *  - Route to the best provider dynamically
 */
export class OrchestratorService {
    /** Registry of available providers implementing the IModelProvider interface */
    private providers: Record<string, IModelProvider>;

    constructor() {
        /**
         * Initialized all LLM providers.
         * In real system, each key would be loaded dynamically from config/env variables
         */
        this.providers = {
            gpt4o: new GPTProvider(process.env.OPENAI_API_KEY || ""),
            claude: new ClaudeProvider(process.env.CLAUDE_API_KEY || ""),
            gemini: new GeminiProvider(process.env.GEMINI_API_KEY || "")
        };
    }

    /**
     * Main routing entrypoint.
     * Decides which model to use for the given prompt.
     * @param prompt -> user query or message content
     * @param strategy -> explicit model name or "auto" for dynamic routing
     */
    async routePrompt(
        prompt: string,
        strategy: "auto" | keyof OrchestratorService["providers"] = "auto"
    ) {
        /**
         * Step 1: Manual Override
         * If explicit model requested, (manual override)
         * Skip all scoring logic and directly route to that model
         */
        if (strategy !== "auto") {
            const provider = this.providers[strategy];
            if (!provider) {
                throw new Error(`Unknown provider: ${strategy}`);
            }
            return provider.sendPrompt(prompt);
        }
        /**
         * Step 2: Estimate prompt Complexity
         * A rough heuristic -longer text or more questions = more complex task.
         * In later point, these would be dynamic values based on historical data
         */
        const complexity = this.estimateComplexity(prompt);

        /**
         * Step 3: Define Model Profiles
         * For now, mock values that simulate:
         * - cost: relative price per reqeuest (1= cheap, 3= expensive)
         * - latency: avgerage response time in ms
         * Later point, these would be replaced by live telemetry data pulled from redis or Prometheus
         */
        const profiles = [
            {
                key: "gpt4o",
                cost: 3,
                latency: 80
            },
            {
                key: "claude",
                cost: 2,
                latency: 120
            },
            {
                key: "gemini",
                cost: 1,
                latency: 150
            }
        ];

        /**
         * Step 4: Compujte weighted score for each model
         * Formula:
         *  score = (cost * 0.4) + (latency * 0.6) + (complexity * 0.2)
         * - cost -> matters for budget-conscious routing (40%)
         * - latency -> impacts user experience, higher weight for better UX (60%)
         * - complexity -> reflects task difficulty, small bump for complex queries (20%)
         * Lower score = better choice
         * Weights can be adjusted based on business priorities (e.g. cost vs speed)
         */
        const ranked = profiles.map((p) => ({
            ...p,
            score: p.cost * 0.4 + p.latency * 0.6 + complexity * 0.2
        }));

        if (ranked.length === 0) {
            throw new Error("No available model profiles to rank - orchestration aborted.");
        }

        ranked.sort((a, b) => a.score - b.score);

        /**
         * Step 5: Route to best model
         * Select the top-ranked provider and route the prompt
         */
        const chosen = ranked[0];
        // Added for typescript, safety - should never happen due to earlier check
        if (!chosen) {
            throw new Error("No suitable model found after ranking - orchestration aborted.");
        }
        const provider = this.providers[chosen.key];
        const result = await provider.sendPrompt(prompt);

        // Attach decision metadata for observability (logs or metrics)
        return {
            ...result,
            chosenStrategy: chosen.key,
            decisionBasis: ranked
        };
    }

    /**
     * Complexity estimator
     * Calculates a simple "complexity score" for the input text:
     * - Each 100 characters = +1 point
     * - Each question mark = +1 point
     * - Capped at a maximum of 5 for length
     *
     * Examples:
     * "Hi"                                 -> 0.02
     * "Explain AI?"                        -> 1.3
     * "Write a detailed business plan?"    -> 2.2
     */
    private estimateComplexity(prompt: string): number {
        const lengthScore = Math.min(prompt.length / 100, 5);
        const questionCount = (prompt.match(/\?/g) || []).length;
        return lengthScore + questionCount;
    }
}

export const orchestratorService = new OrchestratorService();
