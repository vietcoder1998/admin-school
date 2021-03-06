import {REDUX} from '../../const/actions';
import {IAnnouncementDetail} from '../../models/announcement_detail';

interface IInitState {
    data: IAnnouncementDetail;
}

let initState: IInitState = {
    data: {
        id: "",
        admin: {},
        viewNumber: 0,
        modifyAdmin: {},
        announcementType: {id: 0, name: "", priority: 0},
        hidden: false,
        imageUrl: "",
        content: "",
    }
};

export const AnnouncementDetail = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL:
            return {
                ...state,
                data: action.data
            };

        default:
            return state;
    }
};