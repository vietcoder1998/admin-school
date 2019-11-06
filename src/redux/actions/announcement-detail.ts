import { REDUX } from './../../common/const/actions';

export const getAnnouncementDetail = (data: any) => ({
    type: REDUX.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL, 
    data
});