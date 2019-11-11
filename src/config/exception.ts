import { notification } from 'antd';

export const exceptionShowNoti = async (err: any) => {
    if (err && err && err.response && err.response.data) {
        let res = err.response.data;
        notification.error({ description: `${res.msg} (code=${res.code})`, message: "Worksvn thông báo" })
        return err.response.data;
    } else {
        if (err) {
            notification.error({ description: `${"máy chủ gặp vấn đề hoặc kiểm tra lại kết nối của bạn"} (code=${500})`, message: "Worksvn thông báo" })
        }
    }

}