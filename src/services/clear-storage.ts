
// import {notification} from "antd";

export default async function clearStorage() {
    localStorage.removeItem("userID");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("last_url");

    // let cookies = new Cookies();
    // await cookies.remove("actk", { path: "/" });
    // await cookies.remove("t_e_actk", { path: "/" });
    // await cookies.remove("t_e_rftk", { path: "/" });
    // await cookies.remove("rftk", { path: "/" });

    await setTimeout(() => window.location.href = "/login", 1000)
}