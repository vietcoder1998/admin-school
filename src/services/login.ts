import {_requestToServer} from './exec';
import {loginHeaders} from './auth';
import {ADMIN_LOGIN} from './api/public.api';
import {POST} from '../common/const/method';
import Cookies from 'universal-cookie';

interface IUserPasswordDto {
    username: string | undefined;
    password: string | undefined;
}

export function login(data: IUserPasswordDto) {
    _requestToServer(
        POST, ADMIN_LOGIN,
        data,
        {},
        loginHeaders(process.env.REACT_APP_CLIENT_ID, process.env.REACT_APP_CLIENT_SECRET)
    ).then((res: any) => {
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
            window.location.href = '/admin/job-management/list'
        }
    })
}