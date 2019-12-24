import { IAdminAccount } from './../models/admin-accounts';
import { REDUX } from '../../const/actions';

let initState: IAdminAccount= {

};

export const AdminAccountDetail= (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.ADMIN_ACCOUNTS.GET_ADMIN_ACCOUNT_DETAIL:
            return {
                ...action.data,
            };
        default:
            return state;
    }
};