function getApiUrl(): string {
    const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

    if (!API_URL || API_URL.trim() === "") {
        throw new Error("API_URL não está definida ou está vazia.");
    }

    return API_URL;
}

interface FetchOptions extends RequestInit {
    token?: string;

    cache?: "force-cache" | "no-store";

    next?: {
        revalidate: false | 0 | number;
        tags?: string[];
    };
}

export async function apiClient<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        ...(fetchOptions.headers as Record<string, string>)
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(fetchOptions.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const API_URL = getApiUrl();

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    console.log("STATUS DA RESPOSTA:", response.status);

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            error: "Erro HTTP: " + response.status,
        }));
        throw new Error(error.error || "Erro requisição");
    }

    return response.json();
}