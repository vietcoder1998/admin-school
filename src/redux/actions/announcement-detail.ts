import { IAnnouncementDetail } from './../models/announcement_detail';
import { REDUX } from '../../common/const/actions';

export const getAnnouncementDetail = (data: IAnnouncementDetail) => ({
    type: REDUX.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL, 
    data
});