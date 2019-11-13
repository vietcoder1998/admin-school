import { IRoles } from './../models/roles';
import { REDUX } from '../../common/const/actions';

export const getListMajors = (data: IRoles) => ({
    type: REDUX.ROLES.GET_ROLES, 
    data
});