import axios from 'axios';
import { authHeaders } from './auth';
import { OAUTH2_HOST } from '../environment/dev';

// POST
export const _post = async (data?: any, api?: string, another_host?: string, headers?: any, params?: any) => {
    let host = OAUTH2_HOST;
    if (another_host) {
        host = another_host
    }

    let requestURL = host + api;

    if (headers === null || headers === undefined) {
        headers = authHeaders;
    }

    let response = await axios.post(requestURL, data, { headers,  params });
    return response.data
}

//GET
export const _get = async (params?: any, api?: string, another_host?: string, headers?: any) => {
    let host = OAUTH2_HOST;
    if (another_host) {
        host = another_host
    }

    if (headers === null || headers === undefined) {
        headers = authHeaders
    }

    let requestURL = host + api;
    let response = await axios.get(requestURL, { params: params, headers });

    return response.data
};

// DELETE
export const _delete = async (data?: any, api?: string, another_host?: string, headers?: any, params?: string) => {
    let host = OAUTH2_HOST;
    if (another_host) {
        host = another_host;
    }

    if (headers === null || headers === undefined) {
        headers = authHeaders
    }

    let requestURL = host + api;
    let response = await axios.delete(requestURL, { params: JSON.stringify(params), headers, data });

    return response.data;
};


// PUT
export const _put = async (data?: any, api?: string, another_host?: string, headers?: any, params?: string) => {
    let host = OAUTH2_HOST;
    if (another_host) {
        host = another_host
    }

    if (headers === null || headers === undefined) {
        headers = authHeaders
    }

    let requestURL = host + api;
    let response = await axios.put(requestURL, data, { headers, params });

    return response.data;
};
