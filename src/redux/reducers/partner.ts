import { IPartners } from '../../models/partner';
import { REDUX } from '../../const/actions';

let initState: IPartners = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const Partners = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.PARTNER.GET_LIST_PARTNER:
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