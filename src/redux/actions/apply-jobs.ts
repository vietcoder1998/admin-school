import {IApplyJobs} from '../../models/apply-jobs';
import {REDUX} from '../../const/actions';

export const getListApplyJobs = (data: IApplyJobs) => ({
    type: REDUX.APPLY_JOB.GET_APPLY_JOB,
    data
});
