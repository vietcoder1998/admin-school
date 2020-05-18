import {IEventJobs} from './../../models/event-jobs';
import {REDUX} from '../../const/actions';

let initState: IEventJobs = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const EventJobs = (state: IEventJobs = initState, action: any): IEventJobs => {
    switch (action.type) {
        case REDUX.EVENT_SCHOOLS.GET_LIST_EVENT_JOBS:
            return {
                ...action.data,
            };

        default:
            return state;
    }
};