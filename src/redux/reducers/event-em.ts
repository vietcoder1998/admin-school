import {IEventEms} from '../../models/event-em';
import {REDUX} from '../../const/actions';

let initState: IEventEms = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const EventEms = (state: IEventEms = initState, action: any): IEventEms => {
    switch (action.type) {
        case REDUX.EVENT_SCHOOLS.GET_LIST_EVENT_EM:
            return {
                ...action.data,
            };

        default:
            return state;
    }
};