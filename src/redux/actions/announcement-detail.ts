import { IAnnouTypes } from '../models/annou-types';
import { REDUX } from '../../common/const/actions';

export const getAnnouncementDetail = (data: IAnnouTypes) => ({
    type: REDUX.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL, 
    data
});