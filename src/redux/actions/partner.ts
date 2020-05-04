import { REDUX } from '../../const/actions';
import { IPartners } from './../../models/partner';

export const getListPartners = (data?: IPartners) => ({
    type: REDUX.PARTNER.GET_LIST_PARTNER, 
    data
});