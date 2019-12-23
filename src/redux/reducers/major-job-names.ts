import {IMajorJobNames} from '../models/major-job-names';
import {REDUX} from '../../const/actions';

let initState: IMajorJobNames = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const MajorJobNames = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.MAJOR_JOB_NAMES.GET_MAJOR_JOB_NAMES:
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