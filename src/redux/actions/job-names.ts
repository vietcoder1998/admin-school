import { IPendingJobs } from '../models/pending-job';
import { REDUX } from '../../common/const/actions';

export const getJobName = (data: IPendingJobs) => ({
    type: REDUX.JOB_NAMES.GET_JOB_NAME, 
    data
});