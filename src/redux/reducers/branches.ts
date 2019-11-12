import { IBranches } from '../models/branches';
import { REDUX } from '../../common/const/actions';

let initState: IBranches = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
}

export const Branches = (state = initState, action) => {
    switch (action.type) {
        case REDUX.BRANCHES.GET_BRANCHES:
            return {
                ...state, 
                items: action.data.items,
                pageIndex: action.data.pageIndex,
                pageSize: action.data.pageSize,
                totalItems: action.data.totalItems
            }

        default:
            return state;
    }
}