export const backendConfigDevelopment = {
    port: import.meta.env.VITE_BACKEND_PORT || 3000,
    host: import.meta.env.VITE_BACKEND_HOST || 'localhost'
}

backendConfigDevelopment.baseUrl = `http://${backendConfigDevelopment.host}:${backendConfigDevelopment.port}`

export const backendConfigProduction = {
    port: import.meta.env.VITE_BACKEND_PORT,
    host: import.meta.env.VITE_BACKEND_HOST
}

// Choose the configuration based on the environment variable
export const backendConfig = import.meta.env.VITE_DEVELOPMENT === 'true' ? backendConfigDevelopment : backendConfigProduction;

