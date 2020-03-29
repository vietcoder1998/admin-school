import { REDUX } from '../../const/actions';
import { IPartners } from './../../models/partner';

export const getListPartners = (data?: IPartners) => ({
    type: REDUX.SCHOOLS.GET_SCHOOLS, 
    data
});