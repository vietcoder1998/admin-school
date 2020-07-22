import IWorkingTools from '../../models/working-tools';
import { REDUX } from '../../const/actions';

let initState: IWorkingTools = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const WorkingTools = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.WORKING_TOOL.GET_WORKING_TOOLS:
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