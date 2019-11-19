import {IPendingJobs} from '../models/pending-job';
import {REDUX} from '../../common/const/actions';

export const getJobName = (data: IPendingJobs) => ({
    type: REDUX.MAJOR_JOB_NAMES.GET_MAJOR_JOB_NAMES,
    data
});
