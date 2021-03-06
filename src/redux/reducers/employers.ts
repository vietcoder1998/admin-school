import {REDUX} from '../../const/actions';

let initState = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const Employers = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.EMPLOYER.GET_EMPLOYER:
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