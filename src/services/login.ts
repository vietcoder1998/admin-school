import { routeLink, routePath } from './../const/break-cumb';
import { TYPE } from "./../const/type";
// import { toUnixTime } from "./../utils/toUnixTime";
import { _requestToServer } from "./exec";
import { loginHeaders } from "./auth";
import { ADMIN_LOGIN, RFTK_LOGIN } from "./api/public.api";
import { POST } from "./../const/method";


export function loginUser(data?: any, type?: string) {
  _requestToServer(
    POST,
    type === TYPE.NORMAL_LOGIN ? ADMIN_LOGIN : RFTK_LOGIN,
    data,
    undefined,
    loginHeaders(
      process.env.REACT_APP_CLIENT_ID,
      process.env.REACT_APP_CLIENT_SECRET
    ),
    process.env.REACT_APP_API_HOST,
    false,
    true
  )
    .then((res) => {
      if (res && res.code === 200) {
        // let cookie = new Cookies();
        // let timeEnd = toUnixTime(new Date());
        // cookie.set("actk", res.data.accessToken, { path: "/" });
        // cookie.set("rftk", res.data.refreshToken, { path: "/" });
        // cookie.set("t_e_rftk", res.data.refreshTokenExpSecs, { path: "/" });
        // cookie.set("t_e_actk", timeEnd + res.data.accessTokenExpSecs, {
        //   path: "/",
        // });

        localStorage.setItem("userID", res.data.userID);
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);


        let last_url = localStorage.getItem("last_url");
        if (last_url) {
          window.location.href = last_url;
        } else {
          window.location.href = routeLink.PENDING_JOBS + routePath.LIST;
        }
      }
    })

}

// export function loginByRefreshToken() {
//     _requestToServer(POST, type === )
// }

