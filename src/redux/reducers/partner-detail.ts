import { IPartner } from './../../models/partner';
import { REDUX } from '../../const/actions';

let initState: IPartner = {
    id: null,
    firstName: null,
    lastName: null,
    birthday: null,
    avatarUrl: null,
    email: null,
    phone: null,
    gender: null,
    region: null,
    address: null,
};

export const PartnerDetail = (state: IPartner = initState, action: any): IPartner => {
    switch (action.type) {
        case REDUX.CANDIDATES.GET_CANDIDATE_DETAIL:
            return {
                ...action.data
            };

        default:
            return state;
    };
};