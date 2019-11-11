import { IJobGroups } from './../models/job-groups';
import { REDUX } from '../../common/const/actions';

export const getJobGroups = (data: IJobGroups) => ({
    type: REDUX.JOB_GROUPS.GET_JOB_GROUPS, 
    data
});
