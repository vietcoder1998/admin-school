import {IAdminAccounts} from './../../models/admin-accounts';
import {REDUX} from '../../const/actions';

export const getListAdminAccounts = (data: IAdminAccounts) => ({
    type: REDUX.ADMIN_ACCOUNTS.GET_ADMIN_ACCOUNTS,
    data
});
