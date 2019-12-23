import {ILanguages} from '../models/languages';
import {REDUX} from '../../const/actions';

let initState: ILanguages = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const Languages = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.LANGUAGES.GET_LANGUAGES:
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