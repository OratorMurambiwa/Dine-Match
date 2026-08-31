import axios, { AxiosInstance };


/**
 * Creates the HTTP client used to call the DineMatch backend.
 */
export class ApiClient {

    private static client: AxiosInstance;


    /**
     * Returns the existing HTTP client or creates one.
     */
    public static getClient(): AxiosInstance {
        if (!ApiClient.client) {
            ApiClient.client = axios.create({
                baseURL:
                    import.meta.env.VITE_API_URL
                    ?? "http://localhost:3000/api",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        return ApiClient.client;
    }
}