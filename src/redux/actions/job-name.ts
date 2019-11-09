import { IPendingJobs } from '../models/pending-job';
import { REDUX } from '../../common/const/actions';

export const getJobName = (data: IPendingJobs) => ({
    type: REDUX.JOB_NAME.GET_JOB_NAME, 
    data
});