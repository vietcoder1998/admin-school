import { IMajors } from './../models/majors';
import { REDUX } from '../../common/const/actions';

let initState: IMajors = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
}

export const Majors = (state = initState, action) => {
    switch (action.type) {
        case REDUX.MAJORS.GET_MAJORS:
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