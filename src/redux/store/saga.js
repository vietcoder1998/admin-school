import { all } from 'redux-saga/effects';
import { PendingJobsWatcher } from '../sagas/pending-jobs';
import { JobNameWatcher } from '../sagas/job-name';


export default function* rootSaga() {
    yield all([
        PendingJobsWatcher(),
        JobNameWatcher()
    ])
} 