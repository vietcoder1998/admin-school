import {IJobNames} from '../models/job-type';
import {REDUX} from '../../common/const/actions';

let initState: IJobNames = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const JobNames = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.JOB_NAMES.GET_JOB_NAMES:
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