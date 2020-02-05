import {IRoles, IRole} from './../../models/roles';
import {REDUX} from '../../const/actions';

export const getListRoles = (data: IRoles) => ({
    type: REDUX.ROLES.GET_ROLES,
    data
});
