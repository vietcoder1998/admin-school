import { REDUX } from './../../common/const/actions';

export const getAnnouncements = (data: any) => ({
    type: REDUX.ANNOUNCEMENTS.GET_ANNOUNCEMENTS, 
    data
});