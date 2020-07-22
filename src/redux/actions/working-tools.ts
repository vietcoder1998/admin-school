import {IPendingJobs} from '../../models/pending-jobs';
import {REDUX} from '../../const/actions';

export const getWorkingTool = (data: IPendingJobs) => ({
    type: REDUX.WORKING_TOOL.GET_WORKING_TOOLS,
    data
});

// export const getSingleWorkingTool = (data: any) => ({
//     type: REDUX.JOB_NAMES.GET_SINGLE_JOB_NAME,
// });