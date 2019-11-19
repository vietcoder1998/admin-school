import Cookies from 'universal-cookie';
import Swal from "sweetalert2";

export default async function clearStorage() {
    localStorage.clear();
    let cookies = new Cookies();
    await cookies.remove("actk", { path: "/" });
    await cookies.remove("t_e_actk", { path: "/" });
    await cookies.remove("t_e_rftk", { path: "/" });
    await cookies.remove("rftk", { path: "/" });
    await cookies.set("atlg", false);

    Swal.fire(
        "Workvns thông báo",
        "Bạn đã đăng xuất khỏi Worksvn",
        "success"
    )

    await setTimeout(() => window.location.href = "/login", 2000)
}