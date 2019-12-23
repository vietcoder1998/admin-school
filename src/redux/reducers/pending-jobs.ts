import { REDUX } from '../../const/actions';
import { IPendingJobs } from '../models/pending-jobs';

let initState: IPendingJobs = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const PendingJobs = (state = initState, action: any): IPendingJobs => {
    switch (action.type) {
        case REDUX.PENDING_JOBS.GET_PENDING_JOBS:
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