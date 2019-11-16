import {notification} from 'antd';
import {GET, POST, PUT, DELETE} from '../common/const/method';
import {_delete, _get, _post, _put} from './base-api';
import Swal from 'sweetalert2';

export const _requestToServer = async (
    method: string,
    api: string,
    data?: any,
    params?: any,
    headers?: any,
    host?: string,
    show_noti = true,
    show_alert = false
) => {
    if (!host) {
        host = process.env.REACT_APP_API_HOST;
    }
    let response;
    try {
        logRequest(method, host, api, data, params, headers);
        switch (method) {
            case GET:
                response = await _get(host, api, params, headers);
                break;
            case POST:
                response = await _post(host, api, data, params, headers);
                break;
            case PUT:
                response = await _put(host, api, data, params, headers);
                break;
            case DELETE:
                response = await _delete(host, api, data, params, headers);
                break;
            default:
                break;
        }
        logResponse(method, host, api, response, params, headers);
        if (response) {
            let data = response.data;
            if (show_noti) {
                notification.success({
                    message: "Thành công (" + data.code + ")",
                    description: data.msg,
                })
            }
            if (show_alert) {
                Swal.fire(
                    "Thành công",
                    data.msg,
                    'success',
                );
            }
        }
        return response;
    } catch (err) {
        let code;
        let msg;
        console.log(err.toJSON());
        if (err.response) {
            let data = err.response.data;
            if (data) {
                code = data.code;
                msg = data.msg;
            } else {
                code = err.response.code;

            }
        } else {
            code = "UNKNOWN";
            msg = err.message;
            console.log("[UNEXPECTED ERROR] " + err.toJSON());
        }
        if (show_noti) {
            notification.error({
                message: "Có lỗi xảy ra (" + code + ")",
                description: msg,
            })
        }
        if (show_alert) {
            Swal.fire(
                "Có lỗi xảy ra",
                msg,
                'error',
            );
        }
        throw err;
    }
};

function logRequest(method: string, host: string | undefined, api: string, body?: any, params?: any, headers?: any) {
    if (process.env.REACT_APP_ENABLE_LOGGING) {
    console.log(">> REQUEST\n" +
        ">> api: " + method + " " + host + api + "\n" +
        ">> body: " + JSON.stringify(body) + "\n" +
        ">> params: " + JSON.stringify(params) + "\n" +
        ">> headers: " + JSON.stringify(headers) + "\n" +
        ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    }
}

function logResponse(method: string, host: string | undefined, api: string, responseBody?: any, params?: any, headers?: any) {
    if (process.env.REACT_APP_ENABLE_LOGGING) {
    console.log(">> REPONSE\n" +
        "<< api: " + method + " " + host + api + "\n" +
        "<< body: " + JSON.stringify(responseBody) + "\n" +
        "<< params: " + JSON.stringify(params) + "\n" +
        "<< headers: " + JSON.stringify(headers) + "\n" +
        ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    }
}