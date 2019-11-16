import {loginHeaders} from './auth';
import {REFRESH_TOKEN_LOGIN} from './api/public.api';
import {POST} from '../common/const/method';
import Cookies from 'universal-cookie';
import {_requestToServer} from './exec';

let cookies = new Cookies();

export function Atlg() {
    let actk = cookies.get("actk");
    let atlg = cookies.get("atlg");
    let refreshTokenDto = cookies.get("rftk");
    let tl = cookies.get("tl");

    if (atlg === "true" && actk === true) {
        _requestToServer(
            POST, REFRESH_TOKEN_LOGIN,
            refreshTokenDto,
            null,
            loginHeaders(process.env.REACT_APP_CLIENT_ID, process.env.REACT_APP_CLIENT_SECRET)
        ).then((res: any) => {
            if (res) {
                let exp = new Date((new Date().getTime() + res.data.accessTokenExpSecstoDate) / 1000);
                let cookie = new Cookies();

                cookie.set("actk", res.data.accessToken, {expires: exp, path: "/"});
                cookie.set("rftk", res.data.refreshToken, {expires: exp, path: "/"});

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
}