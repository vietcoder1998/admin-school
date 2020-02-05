import {IJobGroups} from './../../models/job-groups';
import {REDUX} from '../../const/actions';

export const getListJobGroups = (data: IJobGroups) => ({
    type: REDUX.JOB_GROUPS.GET_JOB_GROUPS,
    data
});
