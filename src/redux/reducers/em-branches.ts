import { IEmBranches } from '../../models/em-branches';
import { REDUX } from '../../const/actions';

let initState: IEmBranches = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
}

export const EmBranches = (state: IEmBranches = initState, action: any): IEmBranches => {
    switch (action.type) {
        case REDUX.EM_BRANCHES.GET_EM_BRANCHES:
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