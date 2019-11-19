import {IAnnouncements} from '../models/announcements';
import {REDUX} from '../../common/const/actions';

let initState: IAnnouncements = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const Announcements = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.ANNOUNCEMENTS.GET_ANNOUNCEMENTS:
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