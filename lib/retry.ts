import { AxiosRequestConfig } from "axios";
import { toast } from "sonner";

export interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
    __isRetryRequest?: boolean;
  }
  
export async function retry<T>(
    fn: (config?: AxiosRequestConfigWithRetry) => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: any;
  
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Pass retry flag to request
        return await fn({ __isRetryRequest: attempt > 0 });
      } catch (err: any) {
        lastError = err;
        if (attempt < retries) {
          console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  
    if (lastError?.message) toast.error(lastError.message);
    throw lastError;
  }
  