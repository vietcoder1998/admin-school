import Cookies from 'universal-cookie';
import {notification} from "antd";

export default async function clearStorage() {
    localStorage.clear();
    let cookies = new Cookies();
    await cookies.remove("actk", { path: "/" });
    await cookies.remove("t_e_actk", { path: "/" });
    await cookies.remove("t_e_rftk", { path: "/" });
    await cookies.remove("rftk", { path: "/" });
    notification.success({
        message: "Thành công",
        description: "Đăng xuất thành công",
    });

    await setTimeout(() => window.location.href = "/login", 2500)
}