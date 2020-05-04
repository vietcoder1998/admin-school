import { IPartner } from './../../models/partner';
import { REDUX } from './../../const/actions';

export const getCandidateDetail = (data?: IPartner) => ({
    type: REDUX.PARTNER.GET_PARTNER_DETAIL, 
    data
});