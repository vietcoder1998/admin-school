import { IRoles } from '../models/roles';
import { REDUX } from '../../common/const/actions';

let initState: IRoles = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
    role_detail: {}
};

export const Roles = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.ROLES.GET_ROLES:
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