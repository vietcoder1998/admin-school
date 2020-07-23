import { REDUX } from '../../const/actions';
import IConnectEmSchools from '../../models/connect-em-school';

let initState: IConnectEmSchools= {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const ConnectEmSchools= (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.CONNECT_EM_SCHOOL.GET_CONNECT_EM_SCHOOL:
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