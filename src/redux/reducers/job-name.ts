import { IJobNames } from './../models/job-type';
import { REDUX } from '../../common/const/actions';

let initState: IJobNames = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
}

export const JobName = (state = initState, action) => {
    console.log(action)
 
    switch (action.type) {
        case REDUX.JOB_NAME.GET_JOB_NAME:
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