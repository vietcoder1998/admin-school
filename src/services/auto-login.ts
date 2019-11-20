import { TYPE } from './../common/const/type';
import { toUnixTime } from './../common/utils/toUnixTime';
import Cookies from 'universal-cookie';
import { loginUser } from './login';

export function Atlg() {
    let cookie = new Cookies();
    let atlg = cookie.get("atlg");
    let actk = cookie.get("actk");
    if (atlg === true && actk) {
        let rftk = cookie.get("rftk");
        let timeEnd = cookie.get("t_e_actk");
        if (timeEnd < toUnixTime(new Date())) {
            loginUser(rftk, TYPE.REFESH_LOGIN)
        }
    } else {
        cookie.set("atlg", false, {path: "/"});
    }
}