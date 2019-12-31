import { IAdminAccounts} from '../../models/admin-accounts';
import { REDUX } from '../../const/actions';

let initState: IAdminAccounts= {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
    role_detail: {}
};

export const AdminAccounts= (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.ADMIN_ACCOUNTS.GET_ADMIN_ACCOUNTS:
            return {
                ...state,
                items: action.data.items,
                pageIndex: action.data.pageIndex,
                pageSize: action.data.pageSize,
                totalItems: action.data.totalItems
            };
        default:
            return state;
    }
};