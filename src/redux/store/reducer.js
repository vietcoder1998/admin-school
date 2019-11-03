import { combineReducers } from 'redux';
import {PendingJobs} from './../reducers/pending-jobs';
import {JobType} from './../reducers/job-type';

const myReducer = combineReducers({
    PendingJobs,
    JobType
})

export default myReducer