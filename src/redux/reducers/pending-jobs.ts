import { REDUX } from './../../common/const/actions';
import { IPendingJobs } from './../../common/models/pending-job';

let initState: IPendingJobs = {
    list_jobs: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
}

export const PendingJobs = (state = initState, action): IPendingJobs => {
    console.log(action)
 
    switch (action.type) {
        case REDUX.PENDING_JOBS.GET_PENDING_JOBS:
            return {
                ...state, 
                list_jobs: action.data.list_jobs,
                pageIndex: action.data.pageIndex,
                pageSize: action.data.pageSize,
                totalItems: action.data.totalItems
            }

        default:
            return state;
    }
}