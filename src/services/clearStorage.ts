import Cookies from 'universal-cookie';
import swal from "sweetalert";
import { TYPE } from './../common/const/type';

export default async function clearStorage() {
    localStorage.clear();
    let cookies = new Cookies();
    await cookies.remove("actk", { path: "/" });

    await swal({
        title: "Workvns thông báo",
        text: "Bạn đã đăng xuất khỏi Worksvn",
        icon: TYPE.SUCCESS,
        dangerMode: false,
    })
    await setTimeout(() => window.location.href = "/login", 2000)
}