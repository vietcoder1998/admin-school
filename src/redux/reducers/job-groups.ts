import {IJobGroups} from '../../models/job-groups';
import {REDUX} from '../../const/actions';

let initState: IJobGroups = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const JobGroups = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.JOB_GROUPS.GET_JOB_GROUPS:
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