import { TYPE } from "../const/type";

export const typeJob = (type?: string) => {
    if (type) {
        let new_type = type.toLowerCase();
        let value = "";
        switch (type) {
            case TYPE.PENDING:
                value = "Đang chờ"
                return;

            case TYPE.ACCEPTED:
                value = "Đã chấp nhận"
                break;
            case TYPE.REJECTED:
                value = "Từ chối"
                break;
        }

        console.log(new_type, value)
        return { new_type, value };
    }
}