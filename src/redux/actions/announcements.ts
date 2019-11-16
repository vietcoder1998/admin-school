import { REDUX } from '../../common/const/actions';
import { IAnnouncements } from '../models/announcements';

export const getAnnouncements = (data: IAnnouncements) => ({
    type: REDUX.ANNOUNCEMENTS.GET_ANNOUNCEMENTS, 
    data
});