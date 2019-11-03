import { IPendingJobs } from '../../common/models/pending-job';
import { REDUX } from '../../common/const/actions';

export const getJobType = (data: IPendingJobs) => ({
    type: REDUX.JOB_TYPE.GET_JOB_TYPE, 
    data
});