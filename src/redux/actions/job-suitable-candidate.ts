import { IJobSuitableCandidates } from './../../models/job-suitable-candidate';
import { REDUX } from '../../const/actions';

export const getJobAnnouncementDetail = (data?: IJobSuitableCandidates) => ({
    type: REDUX.JOB_SUITABLE_CANDIDATE.GET_JOB_SUITABLE_CANDIDATE, 
    data
});