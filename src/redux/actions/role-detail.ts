import {REDUX} from '../../common/const/actions';
import {IRole} from '../models/roles';

export const getRolesDetail = (data: IRole) => ({
    type: REDUX.ROLES.GET_ROLE_DETAIL,
    data
});