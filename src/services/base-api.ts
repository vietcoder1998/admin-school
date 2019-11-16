import axios from 'axios';

// axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.put['Content-Type'] = 'application/json';
// axios.defaults.headers.delete['Content-Type'] = 'application/json';

export const _get = async (host: string | undefined, api: string,
                           params?: any, headers?: any) => {
    return await axios.get(host + api, {headers, params});
};

export const _post = async (host: string | undefined, api: string,
                            data?: any, params?: any, headers?: any) => {
    return await axios.post(host + api, data, {headers, params});
};

export const _put = async (host: string | undefined, api: string,
                           data?: any, params?: string, headers?: any) => {
    return await axios.put(host + api, data, {headers, params});
};

export const _delete = async (host: string | undefined, api: string,
                              data?: any, params?: string, headers?: any) => {
    return await axios.delete(host + api, {headers, params: JSON.stringify(params), data});
};


