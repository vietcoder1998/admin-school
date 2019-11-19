import { TYPE } from './../common/const/type';
import { toUnixTime } from './../common/utils/toUnixTime';
import { _requestToServer } from './exec';
import { loginHeaders } from './auth';
import { ADMIN_LOGIN, RFTK_LOGIN } from './api/public.api';
import { POST } from './../common/const/method';
import Cookies from 'universal-cookie';
import { OAUTH2_HOST } from '../environment/dev';

export function loginUser(data?: any, type?: string) {
    _requestToServer(
        POST,
        data,
        type === TYPE.NORMAL_LOGIN ? ADMIN_LOGIN : RFTK_LOGIN,
        OAUTH2_HOST,
        loginHeaders("worksvn-admin-web", "worksvn-admin-web@works.vn"),
        null,
        false,
        true
    ).then(res => {
        if (res && res.code === 200) {
            let cookie = new Cookies();
            let timeEnd = toUnixTime(new Date());
            cookie.set("actk", res.data.accessToken, { path: '/' });
            cookie.set("rftk", res.data.refreshToken, { path: '/' });
            cookie.set("t_e_rftk",res.data.refreshTokenExpSecs, { path: '/' });
            cookie.set("t_e_actk", timeEnd + res.data.accessTokenExpSecs, { path: '/' });
            localStorage.setItem("userID", res.data.userID);
            localStorage.setItem("token", res.data.accessToken);
            let last_url = localStorage.getItem("last_url");
            if (last_url) {
                window.location.href = last_url;
            } else {
                window.location.href = '/admin/pending-jobs';
            }
        }
    })
}