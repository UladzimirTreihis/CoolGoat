import axios from 'axios';
import { backendConfig } from '../../config/config.js';


export function useApi() {

    const baseUrl = backendConfig.baseUrl;
    async function fetchApi(endpoint, method, body = null) {
        const url = `${baseUrl}/${endpoint}`;

        console.log(endpoint, method);
        console.log(axios.defaults.headers.common['Authorization']);
        try {
            const response = await axios({
                method,
                url,
                data: body
            });
            console.log(response);
            return {
                status: "success",
                data: response.data
            };
        } catch (error) {
            console.log(error);
            if (error.response) {
                return {
                    status: error.response.status,
                    data: error.response.data
                };
            } else if (error.request) {
                return {
                    status: 'network_error',
                    data: error.message
                };
            } else {
                console.log("Error", error.message);
                return {
                    status: 'error',
                    data: error.message
                };
            }
        }
    }

    return {
        get: (endpoint) => fetchApi(endpoint, 'GET'),
        post: (endpoint, body) => fetchApi(endpoint, 'POST', body),
        patch: (endpoint, body) => fetchApi(endpoint, 'PATCH', body),
        delete: (endpoint) => fetchApi(endpoint, 'DELETE')
    }
}