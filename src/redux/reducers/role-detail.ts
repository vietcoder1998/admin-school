import { IRoleDetail } from './../models/role-detail';
import { REDUX } from '../../common/const/actions';

let initState: IRoleDetail = {
    data: {}
}

export const RoleDetail = (state = initState, action) => {
    switch (action.type) {
        case REDUX.ROLES.GET_ROLE_DETAIL:
            return {
                ...state,
                data: action.data,
            }
        default:
            return state;
    }
}