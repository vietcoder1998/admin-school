import { IStudents } from '../../models/students';
import { REDUX } from '../../const/actions';

let initState: IStudents = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const Students = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.STUDENTS.GET_STUDENTS:
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