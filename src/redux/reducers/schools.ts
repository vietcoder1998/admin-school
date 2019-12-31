import { ISchools } from '../../models/schools';
import { REDUX } from '../../const/actions';

let initState: ISchools = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const Schools = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.SCHOOLS.GET_SCHOOLS:
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