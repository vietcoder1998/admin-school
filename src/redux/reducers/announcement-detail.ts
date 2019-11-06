import { REDUX } from '../../common/const/actions';

let initState = {
    data: {}
}

export const AnnouncementDetail = (state = initState, action) => {
    switch (action.type) {
        case REDUX.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL:
            return {
                ...state, 
                data: action.data
            }

        default:
            return state;
    }
}