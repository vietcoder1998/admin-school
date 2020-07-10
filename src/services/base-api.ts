import axios from 'axios';

export const _get = async (host: string | undefined, api: string,
    params?: any, headers?: any) => {
    let res = await axios.get(host + api, { headers, params });
    return res.data;
};

export const _post = async (host: string | undefined, api: string,
    data?: any, params?: any, headers?: any) => {
    let res = await axios.post(host + api, data, { headers, params });
    console.log(headers)
    return res.data;
};

export const _put = async (host: string | undefined, api: string,
    data?: any, params?: string, headers?: any) => {
    let res = await axios.put(host + api, data, { headers, params });
    return res.data;
};

export const _delete = async (host: string | undefined, api: string,
    data?: any, params?: string, headers?: any) => {
    let res = await axios.delete(host + api, { headers, params: JSON.stringify(params), data });
    return res.data;
};


