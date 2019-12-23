import {ITypeSchools} from '../models/type-schools';
import {REDUX} from '../../const/actions';

let initState: ITypeSchools = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const TypeSchools = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.TYPE_SCHOOLS.GET_TYPE_SCHOOLS:
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