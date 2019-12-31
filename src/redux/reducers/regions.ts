import { IRegions } from '../../models/regions';
import { REDUX } from '../../const/actions';

let initState: IRegions = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const Regions = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.REGIONS.GET_REGIONS:
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