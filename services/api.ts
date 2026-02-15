import { AxiosRequestConfigWithRetry } from "@/lib/retry";
import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        
    }
    if(config.url==="resume/parse_resume"){
        config.headers["Content-Type"]="multipart/form-data"
    }
   
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
      const config = error.config as AxiosRequestConfigWithRetry | undefined;
       
      if (!config?.__isRetryRequest) {
        toast.error(error.message);
      }
  
      if (error.response?.status === 401) {
        // handle auth
      }
  
      return Promise.reject(error);
    }
  );
  

export default api;
