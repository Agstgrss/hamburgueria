const isDev = true //mudar para true para desenvolvimento local, false para produção

export const API_CONFIG = {
    BASE_URL: isDev
        ? "http://localhost:3333"
        : "https://backend-production-2d0c.up.railway.app",
    TIMEOUT: 12000,
}