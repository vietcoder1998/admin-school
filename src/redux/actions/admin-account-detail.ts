import {IAdminAccountDetail} from './../models/admin-account-detail';
import {REDUX} from '../../const/actions';

export const getAdminAccountDetail = (data: IAdminAccountDetail) => ({
    type: REDUX.ADMIN_ACCOUNTS.GET_ADMIN_ACCOUNTS,
    data
});
