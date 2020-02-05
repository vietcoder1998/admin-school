import { IApplyCans } from '../../models/apply-cans';
import { REDUX } from '../../const/actions';

let initState: IApplyCans = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const ApplyCans = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.APPLY_CAN.GET_APPLY_CAN:
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