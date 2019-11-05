import { all } from 'redux-saga/effects';
import { PendingJobsWatcher } from '../sagas/pending-jobs';
import { JobNameWatcher } from '../sagas/job-name';
import { TypeManagementWatcher } from '../sagas/type-management';
import { AnnouncementsWatcher } from '../sagas/announcements';


export default function* rootSaga() {
    yield all([
        PendingJobsWatcher(),
        JobNameWatcher(),
        TypeManagementWatcher(),
        AnnouncementsWatcher(),
    ])
} 