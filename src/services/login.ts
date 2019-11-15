import { _requestToServer } from './exec';
import { loginHeaders } from './auth';
import { ADMIN_LOGIN } from './api/public.api';
import { POST } from './../common/const/method';
import Cookies from 'universal-cookie';
import { OAUTH2_HOST } from '../environment/dev';
interface IUserpasswordDto {
    username: string;
    password: string;
}

export function loginUser(data: IUserpasswordDto) {
    _requestToServer(
        POST,
        data,
        ADMIN_LOGIN,
        OAUTH2_HOST,
        loginHeaders("worksvn-admin-web", "worksvn-admin-web@works.vn"),
        null,
        false,
        true
    ).then(res => {
        if (res && res.code === 200) {
            let cookie = new Cookies();
            cookie.set("actk", res.data.accessToken);
            cookie.set("rftk", res.data.refreshToken);
            cookie.set("tl", res.data.refreshTokenExpSecs);

            localStorage.setItem("userID", res.data.userID);
            localStorage.setItem("token", res.data.accessToken);
            
            let last_url = localStorage.getItem("last_url");
            if (last_url) {
                window.location.href = last_url
            } else {
                window.location.href = '/admin/pending-jobs'
            }
        }
    })
}