import {IEventSchools} from '../../models/event-schools';
import {REDUX} from '../../const/actions';

let initState: IEventSchools = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const EventSchools = (state: IEventSchools = initState, action: any): IEventSchools => {
    switch (action.type) {
        case REDUX.EVENT_SCHOOLS.GET_LIST_EVENT_SCHOOLS:
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