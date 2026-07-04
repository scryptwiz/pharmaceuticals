import { Logger } from "./logger";

export interface ApiClientConfig {
  chaosMode: boolean;
  chaosFailureRate: number;
  chaosLatencyRange: [number, number];
  defaultTimeout: number;
  defaultRetries: number;
}

const DEFAULT_CONFIG: ApiClientConfig = {
  chaosMode: false,
  chaosFailureRate: 0.15,
  chaosLatencyRange: [200, 1500],
  defaultTimeout: 5000,
  defaultRetries: 2,
};

export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  setChaosMode(enabled: boolean) {
    this.config.chaosMode = enabled;
    Logger.info(`API Client Chaos Mode: ${enabled ? "ENABLED" : "DISABLED"}`);
  }

  setFailureRate(rate: number) {
    this.config.chaosFailureRate = rate;
  }

  // Simulates a secure network fetch with retries, timeouts, and chaos options
  async request<T>(
    apiCall: () => Promise<T>,
    options: { timeout?: number; retries?: number } = {},
  ): Promise<T> {
    const timeoutMs = options.timeout ?? this.config.defaultTimeout;
    const maxRetries = options.retries ?? this.config.defaultRetries;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        Logger.debug(`API Request: Attempt ${attempt + 1}/${maxRetries + 1}`);
        const result = await this.executeWithTimeout(apiCall, timeoutMs);
        return result;
      } catch (error: any) {
        attempt++;
        Logger.warn(
          `API Request attempt ${attempt} failed: ${error.message || error}`,
        );

        if (attempt > maxRetries) {
          Logger.error(
            `API Request exhausted all ${maxRetries + 1} attempts. Throwing final error.`,
          );
          throw error;
        }

        const backoffDelay = Math.min(200 * Math.pow(2, attempt), 2000);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }

    throw new Error("API request failed unexpectedly");
  }

  private async executeWithTimeout<T>(
    apiCall: () => Promise<T>,
    timeoutMs: number,
  ): Promise<T> {
    let timeoutId: any;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Request Timeout: Exceeded ${timeoutMs}ms`));
      }, timeoutMs);
    });

    const executionPromise = (async () => {
      // 1. Inject Latency if Chaos Mode is enabled
      if (this.config.chaosMode) {
        const [min, max] = this.config.chaosLatencyRange;
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // 2. Inject Random Failures (500/502 status errors) if Chaos Mode is enabled
      if (
        this.config.chaosMode &&
        Math.random() < this.config.chaosFailureRate
      ) {
        const errorStatuses = [500, 502];
        const status =
          errorStatuses[Math.floor(Math.random() * errorStatuses.length)];
        throw new Error(`HTTP Error Status: ${status}`);
      }

      // 3. Execute the actual underlying mock query
      const data = await apiCall();

      // 4. Inject Malformed JSON Payload if Chaos Mode is enabled
      if (
        this.config.chaosMode &&
        Math.random() < this.config.chaosFailureRate
      ) {
        Logger.warn("Chaos Mode: Injecting malformed/corrupt JSON response");
        // Simulate malformed JSON by returning broken data
        if (typeof data === "object" && data !== null) {
          if (Array.isArray(data)) {
            // Cut list or return array with partial elements
            return data.slice(0, Math.floor(data.length / 2)) as any;
          } else {
            // Delete half the keys to simulate partial JSON corruptions
            const keys = Object.keys(data);
            const corruptData = { ...data } as any;
            keys.slice(0, Math.floor(keys.length / 2)).forEach((k) => {
              delete corruptData[k];
            });
            return corruptData;
          }
        }
      }

      return data;
    })();

    try {
      return await Promise.race([executionPromise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const apiClient = new ApiClient();
