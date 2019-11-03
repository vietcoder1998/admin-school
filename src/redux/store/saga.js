import { all } from 'redux-saga/effects';
import { PendingJobsWatcher } from '../sagas/pending-jobs';
import { JobTypeWatcher } from '../sagas/job-type';


export default function* rootSaga() {
    yield all([
        PendingJobsWatcher(),
        JobTypeWatcher()
    ])
} 