import swal from "sweetalert";
import { TYPE } from "../common/const/type";

export const exceptionShowNoti = async (err: any, show_alert) => {
    if (err && err && err.response && err.response.data) {
        if (show_alert) {
            let msg = err.response.data.msg;
            swal({
                title: "Worksvn thông báo",
                text: msg,
                icon: TYPE.ERROR,
                dangerMode: true,
            });
        }

        return err.response.data;
    }

}