import { TYPE } from "./../const/type";
import { toUnixTime } from "./../utils/toUnixTime";
import Cookies from "universal-cookie";
import { loginUser } from "./login";

export function Atlg() {
  let cookie = new Cookies();
  let actk = cookie.get("actk");

//   console.log(actk);

//   if (atlg === true) {
//     let rftk = cookie.get("rftk");
//     loginUser(rftk, TYPE.REFESH_LOGIN);
//   } else {
//     // cookie.set("atlg", false, { path: "/" });
//     console.log("??");
//   }
}
