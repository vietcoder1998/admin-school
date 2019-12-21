import { IJobAnnouncementDetail } from './../models/job-annoucement-detail';
import { REDUX } from '../../common/const/actions';

export const getJobAnnouncementDetail = (data?: IJobAnnouncementDetail) => ({
    type: REDUX.JOB_ANNOUNCEMENT_DETAIL.GET_JOB_ANNOUNCEMENT_DETAIL, 
    data
});