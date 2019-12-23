import { IJobAnnouncements } from '../models/job-announcements';
import { REDUX } from '../../const/actions';

export const getAnnoucements = (data?: IJobAnnouncements) => ({
    type: REDUX.JOB_ANNOUNCEMENTS.GET_JOB_ANNOUNCEMENTS, 
    data
});