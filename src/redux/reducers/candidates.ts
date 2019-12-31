import {ICandidates} from '../../models/candidates';
import {REDUX} from '../../const/actions';

let initState: ICandidates = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const Candidates = (state: ICandidates = initState, action: any): ICandidates => {
    switch (action.type) {
        case REDUX.CANDIDATES.GET_CANDIDATES:
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