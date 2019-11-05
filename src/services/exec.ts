import { notification } from 'antd';
import { GET, POST, PUT, DELETE } from '../common/const/method';
import { _delete, _get, _post, _put } from './base-api';
import { exceptionShowNoti } from '../config/exception';
import swal from 'sweetalert';
import { TYPE } from '../common/const/type';

export const _requestToServer = async (
    method: string,
    data?: any,
    api?: string,
    host?: string,
    headers?: any,
    params?: any,
    show_noti?: boolean,
    show_alert?: boolean,
) => {
    let res;

    try {
        switch (method) {
            case GET:
                res = await _get(params, api, host, headers);
                break;
            case POST:
                res = await _post(data, api, host, headers, params);
                break;
            case PUT:
                res = await _put(data, api, host, headers);
                break;
            case DELETE:
                res = await _delete(data, api, host, headers);
                break;
            default:
                break;
        };

        if (res) {
            if (show_noti) {
                notification.success({ description: res.msg, message: "Worksvn thông báo" })
            } else
                if (show_alert) {
                    swal({
                        title: "Worksvn thông báo",
                        text: res.msg,
                        icon: TYPE.SUCCESS,
                        dangerMode: false,
                    });
                };
        }

    } catch (err) {
        return res = exceptionShowNoti(err);
    }

    return res;
}