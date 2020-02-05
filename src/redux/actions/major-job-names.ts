import {IPendingJobs} from './../../models/pending-jobs';
import {REDUX} from '../../const/actions';

export const getJobName = (data: IPendingJobs) => ({
    type: REDUX.MAJOR_JOB_NAMES.GET_MAJOR_JOB_NAMES,
    data
});
