import { REDUX } from './../../common/const/actions';

let initState = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
}

export const JobType = (state = initState, action) => {
    console.log(action)
 
    switch (action.type) {
        case REDUX.JOB_TYPE.GET_JOB_TYPE:
            return {
                ...state, 
                items: action.data.items,
                pageIndex: action.data.pageIndex,
                pageSize: action.data.pageSize,
                totalItems: action.data.totalItems
            }

        default:
            return state;
    }
}