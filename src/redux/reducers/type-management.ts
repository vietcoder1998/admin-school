import {REDUX} from '../../common/const/actions';

let initState = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const TypeManagement = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT:
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