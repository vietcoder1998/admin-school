import { REDUX } from '../../const/actions';
import { IAnnouncements } from '../models/announcements';

export const getListAnnouncements = (data: IAnnouncements) => ({
    type: REDUX.ANNOUNCEMENTS.GET_ANNOUNCEMENTS, 
    data
});