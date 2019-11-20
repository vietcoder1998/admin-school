import {REDUX} from '../../common/const/actions';

let initState = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const AnnouTypes = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.ANNOU_TYPES.GET_ANNOU_TYPES:
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