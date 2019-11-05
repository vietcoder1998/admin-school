import { combineReducers } from 'redux';
import {PendingJobs} from './../reducers/pending-jobs';
import {JobName} from '../reducers/job-name';

const myReducer = combineReducers({
    PendingJobs,
    JobName
})

export default myReducer